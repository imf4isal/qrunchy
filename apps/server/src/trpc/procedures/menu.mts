import { z } from "zod";
import { publicProcedure, router } from "../index.mjs";
import { db } from "../../db/index.mjs";
import { getCompleteMenuByRestaurant } from "../../db/queries/digitalMenu.mjs";
import {
  variantSchema,
  addonSchema,
  restaurantIdSchema,
  categoryCreateSchema,
} from "./shared/schemas.mjs";

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

// Helper function to transform database menu to frontend format
const transformMenuToFrontend = (menuData: any) => ({
  restaurant: {
    id: menuData.restaurant.id.toString(),
    name: menuData.restaurant.name,
  },
  categories: menuData.categories.map((category: any) => ({
    id: category.id.toString(),
    name: category.name,
    sortOrder: category.sort_order,
    items: category.items.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      price: parseFloat(item.price),
      description: item.description || undefined,
      categoryId: item.category_id.toString(),
      variants: (item.variants || []).map((variant: any) => ({
        id: variant.id.toString(),
        title: variant.name,
        options: (variant.options || []).map((option: any) => ({
          id: option.id.toString(),
          name: option.name,
          price: parseFloat(option.price),
        })),
      })),
      addons: (item.addons || []).map((addon: any) => ({
        id: addon.id.toString(),
        name: addon.name,
        price: parseFloat(addon.price),
      })),
    })),
  })),
});

export const menuProcedures = router({
  // Get complete menu structure for a restaurant
  getComplete: publicProcedure
    .input(restaurantIdSchema)
    .query(async ({ input }) => {
      try {
        const menuData = await getCompleteMenuByRestaurant(input.restaurant_id);
        return transformMenuToFrontend(menuData);
      } catch (error) {
        console.error("Error fetching complete menu:", error);
        throw new Error("Failed to fetch complete menu");
      }
    }),

  // Get menu for customer view (by QR code)
  getByQrCode: publicProcedure
    .input(z.object({ qr_code: z.string().min(1, "QR code is required") }))
    .query(async ({ input }) => {
      try {
        // First, get the QR code data to find the restaurant
        const qrData = await db
          .selectFrom("qr_code")
          .selectAll()
          .where("code", "=", input.qr_code)
          .where("type", "=", "digital")
          .where("status", "=", "used")
          .executeTakeFirst();

        if (!qrData || !qrData.restaurant_id) {
          throw new Error("QR code not found or not active");
        }

        // Get the complete menu for the restaurant
        const menuData = await getCompleteMenuByRestaurant(qrData.restaurant_id);
        return transformMenuToFrontend(menuData);
      } catch (error) {
        console.error("Error fetching menu by QR code:", error);
        throw new Error("Failed to fetch menu");
      }
    }),

  // Bulk import menu from JSON
  bulkImport: publicProcedure
    .input(bulkImportSchema)
    .mutation(async ({ input }) => {
      try {
        return await db.transaction().execute(async (trx) => {
          // If replace_existing is true, delete existing data
          if (input.replace_existing) {
            // Get all categories for restaurant
            const categories = await trx
              .selectFrom("category")
              .select("id")
              .where("restaurant_id", "=", input.restaurant_id)
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
              .where("restaurant_id", "=", input.restaurant_id)
              .execute();
          }

          // Create categories
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

          // Create items
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
              .executeTakeFirstOrThrow();

            // Create variants
            if (itemData.variants) {
              for (const variantData of itemData.variants) {
                const variant = await trx
                  .insertInto("variant")
                  .values({
                    name: variantData.title,
                    item_id: item.id,
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
            }

            // Create addons
            if (itemData.addons) {
              for (const addonData of itemData.addons) {
                await trx
                  .insertInto("addon")
                  .values({
                    item_id: item.id,
                    name: addonData.name,
                    price: addonData.price.toFixed(2),
                  })
                  .execute();
              }
            }

            createdItems.push(item);
          }

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

  // Export menu to JSON
  export: publicProcedure
    .input(z.object({ restaurant_id: z.number().int().positive() }))
    .query(async ({ input }) => {
      try {
        const menuData = await getCompleteMenuByRestaurant(input.restaurant_id);
        
        // Transform to export format
        return {
          categories: menuData.categories.map(category => ({
            name: category.name,
          })),
          items: menuData.categories.flatMap(category => 
            category.items.map(item => ({
              name: item.name,
              price: parseFloat(item.price),
              description: item.description || undefined,
              categoryName: category.name,
              variants: item.variants.map(variant => ({
                title: variant.name,
                options: variant.options.map(option => ({
                  name: option.name,
                  price: parseFloat(option.price),
                })),
              })),
              addons: item.addons.map(addon => ({
                name: addon.name,
                price: parseFloat(addon.price),
              })),
            }))
          ),
        };
      } catch (error) {
        console.error("Error exporting menu:", error);
        throw new Error("Failed to export menu");
      }
    }),
});