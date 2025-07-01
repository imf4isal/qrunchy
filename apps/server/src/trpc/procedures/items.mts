import { z } from "zod";
import { publicProcedure, router } from "../index.mjs";
import { db } from "../../db/index.mjs";
import {
  getItemsWithDetailsByCategory,
  getItemWithDetailsById,
  createItemWithDetails,
  deleteItemCascade,
} from "../../db/queries/digitalMenu.mjs";
import {
  variantSchema,
  addonSchema,
  restaurantIdSchema,
  categoryIdSchema,
  idSchema,
} from "./shared/schemas.mjs";

const menuItemCreateSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  price: z.number().min(0, "Price must be non-negative"),
  description: z.string().optional(),
  category_id: z.number().int().positive(),
  sort_order: z.number().int().min(0).optional(),
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
  variants: z.array(variantSchema).optional(),
  addons: z.array(addonSchema).optional(),
});

const transformItemToFrontend = (item: any) => ({
  id: item.id.toString(),
  name: item.name,
  price: parseFloat(item.price),
  description: item.description || undefined,
  categoryId: item.category_id.toString(),
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

export const itemsProcedures = router({
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
      // TODO: Implement complex update with variants and addons
      // This requires careful handling of existing variants/addons
      throw new Error("Update item not implemented yet");
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
});
