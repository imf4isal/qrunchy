import { z } from "zod";
import { publicProcedure } from "../index.mts";
import { db } from "../../db/index.mts";
import {
  getItemsWithDetailsByCategory,
  getItemWithDetailsById,
  createItemWithDetails,
  deleteItemCascade,
} from "../../db/queries/digitalMenu.mts";
import {
  variantSchema,
  addonSchema,
  variantUpdateSchema,
  addonUpdateSchema,
  restaurantIdSchema,
  categoryIdSchema,
  idSchema,
} from "./shared/schemas.mts";

const menuItemCreateSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  price: z.number().min(0, "Price must be non-negative"),
  description: z.string().optional(),
  category_id: z.number().int().positive(),
  sort_order: z.number().int().min(0).optional(),
  image_url: z.string().url("Invalid image URL").optional(),
  variants: z.array(variantSchema).optional(),
  addons: z.array(addonSchema).optional(),
});

const menuItemUpdateSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Item name is required").optional(),
  price: z.number().min(0, "Price must be non-negative").optional(),
  description: z.string().optional(),
  category_id: z.number().int().positive().optional(),
  sort_order: z.number().int().min(0).optional(),
  image_url: z.string().url("Invalid image URL").optional(),
  variants: z.array(variantUpdateSchema).optional(),
  addons: z.array(addonUpdateSchema).optional(),
});

const transformItemToFrontend = (item: any) => ({
  id: item.id.toString(),
  name: item.name,
  price: parseFloat(item.price),
  description: item.description || undefined,
  categoryId: item.category_id.toString(),
  image_url: item.image_url || undefined,
  variants: (item.variants || []).map((variant: any) => ({
    id: variant.id.toString(),
    title: variant.name, // Note: database 'name' maps to frontend 'title'
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
});

export const itemsProcedures = {
  getByRestaurant: publicProcedure
    .input(restaurantIdSchema)
    .query(async ({ input }) => {
      try {
        const categories = await db
          .selectFrom("category")
          .selectAll()
          .where("restaurant_id", "=", input.restaurant_id)
          .orderBy("sort_order", "asc")
          .execute();

        const result = [];

        for (const category of categories) {
          const items = await getItemsWithDetailsByCategory(category.id);
          const transformedItems = items.map(transformItemToFrontend);

          result.push({
            category: {
              id: category.id.toString(),
              name: category.name,
              sortOrder: category.sort_order,
            },
            items: transformedItems,
          });
        }

        return result;
      } catch (error) {
        console.error("Error fetching items by restaurant:", error);
        throw new Error("Failed to fetch items");
      }
    }),

  getByCategory: publicProcedure
    .input(categoryIdSchema)
    .query(async ({ input }) => {
      try {
        const items = await getItemsWithDetailsByCategory(input.category_id);
        return items.map(transformItemToFrontend);
      } catch (error) {
        console.error("Error fetching items by category:", error);
        throw new Error("Failed to fetch items");
      }
    }),

  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input }) => {
      try {
        const item = await getItemWithDetailsById(input.id);

        if (!item) {
          throw new Error("Item not found");
        }

        return transformItemToFrontend(item);
      } catch (error) {
        console.error("Error fetching item by id:", error);
        throw new Error("Failed to fetch item");
      }
    }),

  create: publicProcedure
    .input(menuItemCreateSchema)
    .mutation(async ({ input }) => {
      try {
        const item = await createItemWithDetails({
          name: input.name,
          price: input.price,
          description: input.description,
          category_id: input.category_id,
          sort_order: input.sort_order,
          image_url: input.image_url,
          variants: input.variants,
          addons: input.addons,
        });

        const fullItem = await getItemWithDetailsById(item.id);
        return transformItemToFrontend(fullItem);
      } catch (error) {
        console.error("Error creating item:", error);
        throw new Error("Failed to create item");
      }
    }),

  update: publicProcedure
    .input(menuItemUpdateSchema)
    .mutation(async ({ input }) => {
      try {
        return await db.transaction().execute(async (trx) => {
          const { id, variants, addons, ...itemUpdateData } = input;

          // 1. Update basic item info
          if (Object.keys(itemUpdateData).length > 0) {
            await trx
              .updateTable("item")
              .set({
                ...itemUpdateData,
                price: itemUpdateData.price?.toString(),
              })
              .where("id", "=", id)
              .execute();
          }

          // 2. Handle variants update
          if (variants) {
            // Get existing variants
            const existingVariants = await trx
              .selectFrom("variant")
              .selectAll()
              .where("item_id", "=", id)
              .execute();

            // Delete variants that are no longer in the update
            const newVariantIds = variants
              .map(v => v.id ? parseInt(v.id, 10) : null)
              .filter(Boolean) as number[];

            for (const existingVariant of existingVariants) {
              if (!newVariantIds.includes(existingVariant.id)) {
                // Delete variant options first
                await trx
                  .deleteFrom("variant_option")
                  .where("item_variant_id", "=", existingVariant.id)
                  .execute();
                
                // Delete variant
                await trx
                  .deleteFrom("variant")
                  .where("id", "=", existingVariant.id)
                  .execute();
              }
            }

            // Update or create variants
            for (const variantData of variants) {
              let variantId: number;

              if (variantData.id) {
                // Update existing variant
                variantId = parseInt(variantData.id, 10);
                await trx
                  .updateTable("variant")
                  .set({ name: variantData.title })
                  .where("id", "=", variantId)
                  .execute();
              } else {
                // Create new variant
                const newVariant = await trx
                  .insertInto("variant")
                  .values({
                    name: variantData.title,
                    item_id: id,
                  })
                  .returningAll()
                  .executeTakeFirstOrThrow();
                variantId = newVariant.id;
              }

              // Handle variant options
              if (variantData.options) {
                // Get existing options for this variant
                const existingOptions = await trx
                  .selectFrom("variant_option")
                  .selectAll()
                  .where("item_variant_id", "=", variantId)
                  .execute();

                // Delete options that are no longer in the update
                const newOptionIds = variantData.options
                  .map(o => o.id ? parseInt(o.id, 10) : null)
                  .filter(Boolean) as number[];

                for (const existingOption of existingOptions) {
                  if (!newOptionIds.includes(existingOption.id)) {
                    await trx
                      .deleteFrom("variant_option")
                      .where("id", "=", existingOption.id)
                      .execute();
                  }
                }

                // Update or create options
                for (const optionData of variantData.options) {
                  if (optionData.id) {
                    // Update existing option
                    await trx
                      .updateTable("variant_option")
                      .set({
                        name: optionData.name,
                        price: optionData.price.toString(),
                      })
                      .where("id", "=", parseInt(optionData.id, 10))
                      .execute();
                  } else {
                    // Create new option
                    await trx
                      .insertInto("variant_option")
                      .values({
                        item_variant_id: variantId,
                        name: optionData.name,
                        price: optionData.price.toString(),
                      })
                      .execute();
                  }
                }
              }
            }
          }

          // 3. Handle addons update
          if (addons) {
            // Get existing addons
            const existingAddons = await trx
              .selectFrom("addon")
              .selectAll()
              .where("item_id", "=", id)
              .execute();

            // Delete addons that are no longer in the update
            const newAddonIds = addons
              .map(a => a.id ? parseInt(a.id, 10) : null)
              .filter(Boolean) as number[];

            for (const existingAddon of existingAddons) {
              if (!newAddonIds.includes(existingAddon.id)) {
                await trx
                  .deleteFrom("addon")
                  .where("id", "=", existingAddon.id)
                  .execute();
              }
            }

            // Update or create addons
            for (const addonData of addons) {
              if (addonData.id) {
                // Update existing addon
                await trx
                  .updateTable("addon")
                  .set({
                    name: addonData.name,
                    price: addonData.price.toString(),
                  })
                  .where("id", "=", parseInt(addonData.id, 10))
                  .execute();
              } else {
                // Create new addon
                await trx
                  .insertInto("addon")
                  .values({
                    item_id: id,
                    name: addonData.name,
                    price: addonData.price.toString(),
                  })
                  .execute();
              }
            }
          }

          // 4. Return the updated item with all details
          const updatedItem = await getItemWithDetailsById(id);
          return transformItemToFrontend(updatedItem);
        });
      } catch (error) {
        console.error("Error updating item:", error);
        throw new Error("Failed to update item");
      }
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input }) => {
      try {
        const deletedItem = await deleteItemCascade(input.id);

        return {
          id: deletedItem.id.toString(),
          name: deletedItem.name,
        };
      } catch (error) {
        console.error("Error deleting item:", error);
        throw new Error("Failed to delete item");
      }
    }),

  reorder: publicProcedure
    .input(
      z.object({
        category_id: z.number().int().positive(),
        item_orders: z.array(
          z.object({
            id: z.number().int().positive(),
            sort_order: z.number().int().min(0),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        return await db.transaction().execute(async (trx) => {
          const results = [];

          for (const itemOrder of input.item_orders) {
            const item = await trx
              .updateTable("item")
              .set({ sort_order: itemOrder.sort_order })
              .where("id", "=", itemOrder.id)
              .where("category_id", "=", input.category_id)
              .returningAll()
              .executeTakeFirstOrThrow();

            results.push({
              id: item.id.toString(),
              name: item.name,
              sortOrder: item.sort_order,
            });
          }

          return results;
        });
      } catch (error) {
        console.error("Error reordering items:", error);
        throw new Error("Failed to reorder items");
      }
    }),

  // Update item image
  updateImage: publicProcedure
    .input(z.object({
      id: z.number().int().positive(),
      image_url: z.string().url("Invalid image URL").nullable(),
    }))
    .mutation(async ({ input }) => {
      try {
        const updatedItem = await db
          .updateTable("item")
          .set({ image_url: input.image_url })
          .where("id", "=", input.id)
          .returningAll()
          .executeTakeFirstOrThrow();

        const fullItem = await getItemWithDetailsById(updatedItem.id);
        return transformItemToFrontend(fullItem);
      } catch (error) {
        console.error("Error updating item image:", error);
        throw new Error("Failed to update item image");
      }
    }),

  // Delete item image
  deleteImage: publicProcedure
    .input(idSchema)
    .mutation(async ({ input }) => {
      try {
        const updatedItem = await db
          .updateTable("item")
          .set({ image_url: null })
          .where("id", "=", input.id)
          .returningAll()
          .executeTakeFirstOrThrow();

        const fullItem = await getItemWithDetailsById(updatedItem.id);
        return transformItemToFrontend(fullItem);
      } catch (error) {
        console.error("Error deleting item image:", error);
        throw new Error("Failed to delete item image");
      }
    }),
};
