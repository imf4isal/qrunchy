import { z } from "zod";
import { publicProcedure, router } from "../index.mjs";
import { db } from "../../db/index.mjs";

const restaurantCreateSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  address: z.string().optional(),
  user_id: z.number().int().positive(),
  group_res_id: z.number().int().positive().optional(),
});

const restaurantUpdateSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Restaurant name is required").optional(),
  mobile: z.string().min(1, "Mobile number is required").optional(),
  address: z.string().optional(),
  group_res_id: z.number().int().positive().optional(),
});

const restaurantGetByUserSchema = z.object({
  user_id: z.number().int().positive(),
});

const restaurantGetByIdSchema = z.object({
  id: z.number().int().positive(),
});

export const restaurantProcedures = router({
  create: publicProcedure
    .input(restaurantCreateSchema)
    .mutation(async ({ input }) => {
      try {
        // Verify user exists
        const user = await db
          .selectFrom("user")
          .select("id")
          .where("id", "=", input.user_id)
          .executeTakeFirst();

        if (!user) {
          throw new Error("User not found");
        }

        // Verify group_res exists if provided
        if (input.group_res_id) {
          const groupRes = await db
            .selectFrom("group_res")
            .select("id")
            .where("id", "=", input.group_res_id)
            .where("user_id", "=", input.user_id) // Ensure group belongs to user
            .executeTakeFirst();

          if (!groupRes) {
            throw new Error("Group restaurant not found or does not belong to user");
          }
        }

        // Create restaurant
        const restaurant = await db
          .insertInto("restaurant")
          .values({
            name: input.name,
            mobile: input.mobile,
            address: input.address || null,
            geolocation: "POINT(0 0)", // Default location
            user_id: input.user_id,
            group_res_id: input.group_res_id || null,
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        return {
          id: restaurant.id,
          name: restaurant.name,
          mobile: restaurant.mobile,
          address: restaurant.address,
          user_id: restaurant.user_id,
          group_res_id: restaurant.group_res_id,
          created_at: restaurant.created_at.toISOString(),
          updated_at: restaurant.updated_at.toISOString(),
          is_active: restaurant.is_active,
        };
      } catch (error) {
        console.error("Error creating restaurant:", error);
        throw new Error("Failed to create restaurant");
      }
    }),

  getByUser: publicProcedure
    .input(restaurantGetByUserSchema)
    .query(async ({ input }) => {
      try {
        const restaurants = await db
          .selectFrom("restaurant")
          .selectAll()
          .where("user_id", "=", input.user_id)
          .where("is_active", "=", true)
          .orderBy("created_at", "desc")
          .execute();

        return restaurants.map(restaurant => ({
          id: restaurant.id,
          name: restaurant.name,
          mobile: restaurant.mobile,
          address: restaurant.address,
          user_id: restaurant.user_id,
          group_res_id: restaurant.group_res_id,
          created_at: restaurant.created_at.toISOString(),
          updated_at: restaurant.updated_at.toISOString(),
          is_active: restaurant.is_active,
        }));
      } catch (error) {
        console.error("Error fetching restaurants by user:", error);
        throw new Error("Failed to fetch restaurants");
      }
    }),

  getById: publicProcedure
    .input(restaurantGetByIdSchema)
    .query(async ({ input }) => {
      try {
        const restaurant = await db
          .selectFrom("restaurant")
          .selectAll()
          .where("id", "=", input.id)
          .where("is_active", "=", true)
          .executeTakeFirst();

        if (!restaurant) {
          return null;
        }

        return {
          id: restaurant.id,
          name: restaurant.name,
          mobile: restaurant.mobile,
          address: restaurant.address,
          user_id: restaurant.user_id,
          group_res_id: restaurant.group_res_id,
          created_at: restaurant.created_at.toISOString(),
          updated_at: restaurant.updated_at.toISOString(),
          is_active: restaurant.is_active,
        };
      } catch (error) {
        console.error("Error fetching restaurant by id:", error);
        throw new Error("Failed to fetch restaurant");
      }
    }),

  update: publicProcedure
    .input(restaurantUpdateSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;

        // Verify group_res exists and belongs to user if provided
        if (updateData.group_res_id) {
          const restaurant = await db
            .selectFrom("restaurant")
            .select("user_id")
            .where("id", "=", id)
            .executeTakeFirst();

          if (!restaurant) {
            throw new Error("Restaurant not found");
          }

          const groupRes = await db
            .selectFrom("group_res")
            .select("id")
            .where("id", "=", updateData.group_res_id)
            .where("user_id", "=", restaurant.user_id)
            .executeTakeFirst();

          if (!groupRes) {
            throw new Error("Group restaurant not found or does not belong to user");
          }
        }

        const updatedRestaurant = await db
          .updateTable("restaurant")
          .set(updateData)
          .where("id", "=", id)
          .where("is_active", "=", true)
          .returningAll()
          .executeTakeFirstOrThrow();

        return {
          id: updatedRestaurant.id,
          name: updatedRestaurant.name,
          mobile: updatedRestaurant.mobile,
          address: updatedRestaurant.address,
          user_id: updatedRestaurant.user_id,
          group_res_id: updatedRestaurant.group_res_id,
          created_at: updatedRestaurant.created_at.toISOString(),
          updated_at: updatedRestaurant.updated_at.toISOString(),
          is_active: updatedRestaurant.is_active,
        };
      } catch (error) {
        console.error("Error updating restaurant:", error);
        throw new Error("Failed to update restaurant");
      }
    }),
});