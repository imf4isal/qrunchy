import { z } from "zod";
import { publicProcedure, router } from "../index.mts";
import { db } from "../../db/index.mts";

// Auth-related schemas
const loginSchema = z.object({
  mobile_number: z.string().min(1, "Mobile number is required"),
});

const userSessionSchema = z.object({
  user_id: z.number().int().positive(),
});

export const authProcedures = router({
  // Login - only existing users can login
  login: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if user exists with this mobile number
        const user = await db
          .selectFrom("user")
          .selectAll()
          .where("mobile_number", "=", input.mobile_number)
          .executeTakeFirst();

        // If user doesn't exist, return error
        if (!user) {
          throw new Error("User not registered. Create a menu to register automatically.");
        }

        // Get user's restaurants
        const restaurants = await db
          .selectFrom("restaurant")
          .selectAll()
          .where("user_id", "=", user.id)
          .where("is_active", "=", true)
          .orderBy("created_at", "desc")
          .execute();

        return {
          user: {
            id: user.id,
            mobile_number: user.mobile_number,
            created_at: user.created_at.toISOString(),
            updated_at: user.updated_at.toISOString(),
          },
          restaurants: restaurants.map(restaurant => ({
            id: restaurant.id,
            name: restaurant.name,
            mobile: restaurant.mobile,
            address: restaurant.address,
            theme_id: restaurant.theme_id || "minimal",
            created_at: restaurant.created_at.toISOString(),
            updated_at: restaurant.updated_at.toISOString(),
          })),
        };
      } catch (error) {
        console.error("Error during login:", error);
        // Re-throw the original error message for "not registered" case
        throw error;
      }
    }),

  // Get current user session info
  me: publicProcedure
    .input(userSessionSchema)
    .query(async ({ input }) => {
      try {
        // Get user info
        const user = await db
          .selectFrom("user")
          .selectAll()
          .where("id", "=", input.user_id)
          .executeTakeFirst();

        if (!user) {
          return null;
        }

        // Get user's restaurants
        const restaurants = await db
          .selectFrom("restaurant")
          .selectAll()
          .where("user_id", "=", user.id)
          .where("is_active", "=", true)
          .orderBy("created_at", "desc")
          .execute();

        return {
          user: {
            id: user.id,
            mobile_number: user.mobile_number,
            created_at: user.created_at.toISOString(),
            updated_at: user.updated_at.toISOString(),
          },
          restaurants: restaurants.map(restaurant => ({
            id: restaurant.id,
            name: restaurant.name,
            mobile: restaurant.mobile,
            address: restaurant.address,
            theme_id: restaurant.theme_id || "minimal",
            created_at: restaurant.created_at.toISOString(),
            updated_at: restaurant.updated_at.toISOString(),
          })),
        };
      } catch (error) {
        console.error("Error fetching user session:", error);
        throw new Error("Failed to fetch user session");
      }
    }),

  // Logout - simple procedure that returns success
  // Actual session clearing will be handled on the client side
  logout: publicProcedure
    .mutation(async () => {
      try {
        return {
          success: true,
          message: "Logged out successfully",
        };
      } catch (error) {
        console.error("Error during logout:", error);
        throw new Error("Failed to logout");
      }
    }),
});