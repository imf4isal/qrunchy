import { z } from "zod";
import { publicProcedure } from "../index.mts";
import { db } from "../../db/index.mts";
import {
  createFoodCourt,
  getFoodCourtById,
  getFoodCourtByQrCode,
  updateFoodCourtRestaurants,
  searchFoodCourtItems,
  activateFoodCourt,
  getUserFoodCourts,
  updateFoodCourt,
  deleteFoodCourt,
  checkFoodCourtOwnership,
} from "../../db/queries/foodCourt.mts";

// Validation schemas
const foodCourtCreateSchema = z.object({
  name: z.string().min(1, "Food court name is required"),
  description: z.string().optional(),
});

const foodCourtGetByIdSchema = z.object({
  id: z.number().int().positive(),
});

const foodCourtGetByQrSchema = z.object({
  qr_code: z.string().min(1, "QR code is required"),
});

const foodCourtUpdateRestaurantsSchema = z.object({
  food_court_id: z.number().int().positive(),
  restaurant_ids: z.array(z.number().int().positive()),
});

const foodCourtSearchSchema = z.object({
  food_court_id: z.number().int().positive(),
  query: z.string().min(1, "Search query is required"),
});

const foodCourtUpdateSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Food court name is required").optional(),
  description: z.string().optional(),
});

const foodCourtDeleteSchema = z.object({
  id: z.number().int().positive(),
});

const qrGenerateFoodCourtSchema = z.object({
  food_court_id: z.number().int().positive(),
});

// Helper function to generate unique food court QR code
const generateFoodCourtQrCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `foodcourt_${result}`;
};

export const foodCourtProcedures = {
  // Create food court
  create: publicProcedure
    .input(foodCourtCreateSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Get user ID from context (assuming it's available)
        // For now, we'll extract from a temporary user system
        const user = await db
          .selectFrom("user")
          .select("id")
          .orderBy("created_at", "desc")
          .executeTakeFirst();

        if (!user) {
          throw new Error("User not found");
        }

        const foodCourt = await createFoodCourt({
          name: input.name,
          description: input.description,
          user_id: user.id,
        });

        return { foodCourt };
      } catch (error) {
        console.error("Error creating food court:", error);
        throw new Error("Failed to create food court");
      }
    }),

  // Get QR code for food court (if exists)
  getQrCode: publicProcedure
    .input(foodCourtGetByIdSchema)
    .query(async ({ input }) => {
      try {
        const qrCode = await db
          .selectFrom("qr_code")
          .select(["code", "status", "type"])
          .where("group_res_id", "=", input.id)
          .where("type", "=", "foodcourt")
          .executeTakeFirst();

        if (!qrCode) {
          return { qr_code: null };
        }

        return {
          qr_code: qrCode.code,
          status: qrCode.status,
          type: qrCode.type,
          menu_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu/${qrCode.code}`,
        };
      } catch (error) {
        console.error("Error fetching food court QR code:", error);
        return { qr_code: null };
      }
    }),

  // Get user's food courts
  getByUser: publicProcedure
    .query(async ({ ctx }) => {
      try {
        // Get user ID from context (for now, get the latest user)
        const user = await db
          .selectFrom("user")
          .select("id")
          .orderBy("created_at", "desc")
          .executeTakeFirst();

        if (!user) {
          throw new Error("User not found");
        }

        const foodCourts = await getUserFoodCourts(user.id);
        return { foodCourts };
      } catch (error) {
        console.error("Error fetching user food courts:", error);
        throw new Error("Failed to fetch food courts");
      }
    }),

  // Get food court by ID with restaurants
  getById: publicProcedure
    .input(foodCourtGetByIdSchema)
    .query(async ({ input }) => {
      try {
        const foodCourt = await getFoodCourtById(input.id);
        if (!foodCourt) {
          throw new Error("Food court not found");
        }
        return { foodCourt };
      } catch (error) {
        console.error("Error fetching food court:", error);
        throw new Error("Failed to fetch food court");
      }
    }),

  // Get food court by QR code (for customer view)
  getByQrCode: publicProcedure
    .input(foodCourtGetByQrSchema)
    .query(async ({ input }) => {
      try {
        const foodCourt = await getFoodCourtByQrCode(input.qr_code);
        return { foodCourt };
      } catch (error) {
        console.error("Error fetching food court by QR:", error);
        // Re-throw the original error to preserve custom messages
        throw error;
      }
    }),

  // Update food court restaurants
  updateRestaurants: publicProcedure
    .input(foodCourtUpdateRestaurantsSchema)
    .mutation(async ({ input }) => {
      try {
        await updateFoodCourtRestaurants(input.food_court_id, input.restaurant_ids);
        return { success: true };
      } catch (error) {
        console.error("Error updating food court restaurants:", error);
        throw new Error("Failed to update food court restaurants");
      }
    }),

  // Search items across food court restaurants
  searchItems: publicProcedure
    .input(foodCourtSearchSchema)
    .query(async ({ input }) => {
      try {
        const results = await searchFoodCourtItems(input.food_court_id, input.query);
        return { results };
      } catch (error) {
        console.error("Error searching food court items:", error);
        throw new Error("Failed to search food court items");
      }
    }),

  // Update food court details
  update: publicProcedure
    .input(foodCourtUpdateSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;
        const foodCourt = await updateFoodCourt(id, updateData);
        return { foodCourt };
      } catch (error) {
        console.error("Error updating food court:", error);
        throw new Error("Failed to update food court");
      }
    }),

  // Delete food court
  delete: publicProcedure
    .input(foodCourtDeleteSchema)
    .mutation(async ({ input }) => {
      try {
        await deleteFoodCourt(input.id);
        return { success: true };
      } catch (error) {
        console.error("Error deleting food court:", error);
        throw new Error("Failed to delete food court");
      }
    }),

  // Generate QR code for food court
  generateQr: publicProcedure
    .input(qrGenerateFoodCourtSchema)
    .mutation(async ({ input }) => {
      try {
        return await db.transaction().execute(async (trx) => {
          // Verify food court exists
          const foodCourt = await trx
            .selectFrom("group_res")
            .select(["id", "name", "is_active"])
            .where("id", "=", input.food_court_id)
            .where("type", "=", "foodcourt")
            .executeTakeFirst();

          if (!foodCourt) {
            throw new Error("Food court not found");
          }

          // Check if QR code already exists for this food court
          const existingQr = await trx
            .selectFrom("qr_code")
            .select("code")
            .where("group_res_id", "=", input.food_court_id)
            .where("type", "=", "foodcourt")
            .executeTakeFirst();

          if (existingQr) {
            return {
              qr_code: existingQr.code,
              status: "available",
              type: "foodcourt",
              food_court: {
                id: foodCourt.id.toString(),
                name: foodCourt.name,
                is_active: foodCourt.is_active,
              },
              menu_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu/${existingQr.code}`,
            };
          }

          // Generate unique QR code
          let qrCode: string;
          let attempts = 0;
          const maxAttempts = 10;

          do {
            qrCode = generateFoodCourtQrCode();
            attempts++;

            const existing = await trx
              .selectFrom("qr_code")
              .select("id")
              .where("code", "=", qrCode)
              .executeTakeFirst();

            if (!existing) break;

            if (attempts >= maxAttempts) {
              throw new Error("Failed to generate unique QR code");
            }
          } while (true);

          // Create QR code record
          const qrRecord = await trx
            .insertInto("qr_code")
            .values({
              code: qrCode,
              type: "foodcourt",
              status: "available",
              group_res_id: input.food_court_id,
              bound_at: new Date(),
              expires_at: null, // QR codes don't expire
              self_serve: false,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

          return {
            qr_code: qrRecord.code,
            status: qrRecord.status,
            type: qrRecord.type,
            food_court: {
              id: foodCourt.id.toString(),
              name: foodCourt.name,
              is_active: foodCourt.is_active,
            },
            menu_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu/${qrRecord.code}`,
          };
        });
      } catch (error) {
        console.error("Error generating food court QR code:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to generate QR code");
      }
    }),

  // Get available restaurants (not assigned to any food court or owned by user)
  getAvailableRestaurants: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      exclude_food_court_id: z.number().int().positive().optional(),
    }))
    .query(async ({ input }) => {
      try {
        let query = db
          .selectFrom("restaurant")
          .select([
            "id",
            "name",
            "mobile",
            "address",
            "theme_id",
            "group_res_id",
            "user_id",
          ])
          .where("is_active", "=", true);

        // Add search filter if provided
        if (input.search) {
          const searchTerm = `%${input.search.toLowerCase()}%`;
          query = query.where("name", "ilike", searchTerm);
        }

        const restaurants = await query.execute();

        // Filter out restaurants already in other food courts (but allow those in the current food court being edited)
        const filteredRestaurants = restaurants.filter(restaurant => {
          if (!restaurant.group_res_id) return true; // Not assigned to any group
          if (input.exclude_food_court_id && restaurant.group_res_id === input.exclude_food_court_id) {
            return true; // Allow restaurants from the food court being edited
          }
          return false; // Exclude restaurants assigned to other food courts
        });

        return { restaurants: filteredRestaurants };
      } catch (error) {
        console.error("Error fetching available restaurants:", error);
        throw new Error("Failed to fetch available restaurants");
      }
    }),
};