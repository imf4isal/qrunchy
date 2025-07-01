import { z } from "zod";
import { publicProcedure, router } from "../index.mts";
import { db } from "../../db/index.mts";
import { ItemTable } from "../../types/database.mts";
import {
  variantSchema,
  addonSchema,
  categoryCreateSchema,
} from "./shared/schemas.mts";

// Bulk import schema
const bulkImportSchema = z.object({
  restaurant_id: z.number().int().positive(),
  menu_data: z.object({
    categories: z.array(categoryCreateSchema),
    items: z.array(z.object({
      name: z.string().min(1, "Item name is required"),
      price: z.number().min(0, "Price must be non-negative"),
      description: z.string().optional(),
      categoryName: z.string().min(1, "Category name is required"),
      variants: z.array(variantSchema).optional(),
      addons: z.array(addonSchema).optional(),
    })),
  }),
  replace_existing: z.boolean().default(false),
});

// Helper function to clear existing menu data
const clearExistingMenuData = async (trx: any, restaurantId: number) => {
  // Get all categories for restaurant
  const categories = await trx
    .selectFrom("category")
    .select("id")
    .where("restaurant_id", "=", restaurantId)
    .execute();

  // Delete all items and categories (cascade will handle variants/addons)
  for (const category of categories) {
    // Get items in category
    const items = await trx
      .selectFrom("item")
      .select("id")
      .where("category_id", "=", category.id)
      .execute();

    // Delete variants and addons for each item
    for (const item of items) {
      // Delete variant options first
      const variants = await trx
        .selectFrom("variant")
        .select("id")
        .where("item_id", "=", item.id)
        .execute();

      for (const variant of variants) {
        await trx
          .deleteFrom("variant_option")
          .where("item_variant_id", "=", variant.id)
          .execute();
      }

      // Delete variants
      await trx
        .deleteFrom("variant")
        .where("item_id", "=", item.id)
        .execute();

      // Delete addons
      await trx
        .deleteFrom("addon")
        .where("item_id", "=", item.id)
        .execute();
    }

    // Delete items
    await trx
      .deleteFrom("item")
      .where("category_id", "=", category.id)
      .execute();
  }

  // Delete categories
  await trx
    .deleteFrom("category")
    .where("restaurant_id", "=", restaurantId)
    .execute();
};

// Helper function to create categories
const createCategories = async (trx: any, input: any) => {
  const categoryMap = new Map<string, number>();
  
  for (let i = 0; i < input.menu_data.categories.length; i++) {
    const categoryData = input.menu_data.categories[i];
    const category = await trx
      .insertInto("category")
      .values({
        name: categoryData.name,
        restaurant_id: input.restaurant_id,
        sort_order: i,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    categoryMap.set(categoryData.name, category.id);
  }

  return categoryMap;
};

// Helper function to create variants for an item
const createVariants = async (trx: any, itemId: number, variants: any[]) => {
  for (const variantData of variants) {
    const variant = await trx
      .insertInto("variant")
      .values({
        name: variantData.title,
        item_id: itemId,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    // Create variant options
    for (const optionData of variantData.options) {
      await trx
        .insertInto("variant_option")
        .values({
          item_variant_id: variant.id,
          name: optionData.name,
          price: optionData.price.toFixed(2),
        })
        .execute();
    }
  }
};

// Helper function to create addons for an item
const createAddons = async (trx: any, itemId: number, addons: any[]) => {
  for (const addonData of addons) {
    await trx
      .insertInto("addon")
      .values({
        item_id: itemId,
        name: addonData.name,
        price: addonData.price.toFixed(2),
      })
      .execute();
  }
};

// Helper function to create items
const createItems = async (trx: any, input: any, categoryMap: Map<string, number>) => {
  const createdItems = [];
  
  for (const itemData of input.menu_data.items) {
    const categoryId = categoryMap.get(itemData.categoryName);
    
    if (!categoryId) {
      throw new Error(`Category "${itemData.categoryName}" not found`);
    }

    // Create item
    const item = await trx
      .insertInto("item")
      .values({
        name: itemData.name,
        price: itemData.price.toFixed(2),
        description: itemData.description || null,
        category_id: categoryId,
        sort_order: createdItems.length,
      })
      .returningAll()
      .executeTakeFirstOrThrow() as ItemTable & { id: number };

    // Create variants if provided
    if (itemData.variants) {
      await createVariants(trx, item.id, itemData.variants);
    }

    // Create addons if provided
    if (itemData.addons) {
      await createAddons(trx, item.id, itemData.addons);
    }

    createdItems.push(item);
  }

  return createdItems;
};

export const menuBulkImportProcedures = router({
  // Bulk import menu from JSON
  bulkImport: publicProcedure
    .input(bulkImportSchema)
    .mutation(async ({ input }) => {
      try {
        return await db.transaction().execute(async (trx) => {
          // If replace_existing is true, delete existing data
          if (input.replace_existing) {
            await clearExistingMenuData(trx, input.restaurant_id);
          }

          // Create categories
          const categoryMap = await createCategories(trx, input);

          // Create items
          const createdItems = await createItems(trx, input, categoryMap);

          return {
            message: "Menu imported successfully",
            categories_created: input.menu_data.categories.length,
            items_created: createdItems.length,
          };
        });
      } catch (error) {
        console.error("Error importing menu:", error);
        throw new Error("Failed to import menu");
      }
    }),
});