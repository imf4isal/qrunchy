import { z } from "zod";
import { publicProcedure } from "../index.mts";
import { db } from "../../db/index.mts";
import type { ItemTable } from "../../types/database.mts";
import { StorageFactory } from "../../storage/StorageFactory.mjs";
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
      image_url: z.string().url("Invalid image URL").optional(),
      variants: z.array(variantSchema).optional(),
      addons: z.array(addonSchema).optional(),
    })),
  }),
  replace_existing: z.boolean().default(false),
});

// Helper function to download image from URL and upload to R2
const downloadAndUploadImage = async (imageUrl: string): Promise<string | null> => {
  try {
    // Validate URL
    const url = new URL(imageUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Invalid URL protocol');
    }

    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }

    // Get content type and validate it's an image
    const contentType = response.headers.get('content-type') || '';
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.some(type => contentType.includes(type))) {
      throw new Error(`Invalid image type: ${contentType}`);
    }

    // Get the image buffer
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (buffer.length > maxSize) {
      throw new Error('Image file too large (max 5MB)');
    }

    // Generate filename from URL
    const urlPath = url.pathname;
    const filename = urlPath.split('/').pop() || 'image';
    
    // Upload to R2
    const storage = StorageFactory.getProvider();
    const result = await storage.upload(buffer, filename, {
      folder: 'menuitem',
      contentType: contentType,
    });

    return result.url;
  } catch (error) {
    console.error('Error downloading and uploading image:', error);
    return null; // Return null to skip the image rather than failing the entire import
  }
};

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

    // Handle image URL - download and upload if provided
    let finalImageUrl: string | null = null;
    if (itemData.image_url) {
      // If it's already an R2 URL, keep it as-is (don't re-download)
      if (itemData.image_url.includes('r2.dev') || itemData.image_url.includes('cloudflarestorage.com')) {
        console.log('🔄 Preserving existing R2 image URL:', itemData.image_url);
        finalImageUrl = itemData.image_url;
      } else {
        // External URL - download and re-upload to our R2
        console.log('📥 Downloading external image URL:', itemData.image_url);
        finalImageUrl = await downloadAndUploadImage(itemData.image_url);
      }
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
        image_url: finalImageUrl,
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

export const menuBulkImportProcedures = {
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
};