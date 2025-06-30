import { z } from "zod";
import { publicProcedure, router } from "../index.mjs";
import { db } from "../../db/index.mjs";
import {
  getCategoriesByRestaurant,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../db/queries/digitalMenu.mjs";

const categoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  restaurant_id: z.number().int().positive(),
  sort_order: z.number().int().min(0).optional(),
});

const categoryUpdateSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Category name is required").optional(),
  sort_order: z.number().int().min(0).optional(),
});

export const categoriesProcedures = router({
  getByRestaurant: publicProcedure
    .input(z.object({ restaurant_id: z.number().int().positive() }))
    .query(async ({ input }) => {
      try {
        const categories = await getCategoriesByRestaurant(input.restaurant_id);

        return categories.map((category) => ({
          id: category.id.toString(),
          name: category.name,
          sortOrder: category.sort_order,
        }));
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Failed to fetch categories");
      }
    }),

  create: publicProcedure
    .input(categoryCreateSchema)
    .mutation(async ({ input }) => {
      try {
        const category = await createCategory({
          name: input.name,
          restaurant_id: input.restaurant_id,
          sort_order: input.sort_order,
        });

        return {
          id: category.id.toString(),
          name: category.name,
          sortOrder: category.sort_order,
        };
      } catch (error) {
        console.error("Error creating category:", error);
        throw new Error("Failed to create category");
      }
    }),

  update: publicProcedure
    .input(categoryUpdateSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;
        const category = await updateCategory(id, updateData);

        return {
          id: category.id.toString(),
          name: category.name,
          sortOrder: category.sort_order,
        };
      } catch (error) {
        console.error("Error updating category:", error);
        throw new Error("Failed to update category");
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      try {
        const category = await deleteCategory(input.id);

        return {
          id: category.id.toString(),
          name: category.name,
          sortOrder: category.sort_order,
        };
      } catch (error) {
        console.error("Error deleting category:", error);
        throw new Error("Failed to delete category");
      }
    }),

  reorder: publicProcedure
    .input(
      z.object({
        restaurant_id: z.number().int().positive(),
        category_orders: z.array(
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

          for (const categoryOrder of input.category_orders) {
            const category = await trx
              .updateTable("category")
              .set({ sort_order: categoryOrder.sort_order })
              .where("id", "=", categoryOrder.id)
              .where("restaurant_id", "=", input.restaurant_id)
              .returningAll()
              .executeTakeFirstOrThrow();

            results.push({
              id: category.id.toString(),
              name: category.name,
              sortOrder: category.sort_order,
            });
          }

          return results;
        });
      } catch (error) {
        console.error("Error reordering categories:", error);
        throw new Error("Failed to reorder categories");
      }
    }),
});
