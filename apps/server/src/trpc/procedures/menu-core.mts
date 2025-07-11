import { z } from "zod";
import { publicProcedure } from "../index.mts";
import { db } from "../../db/index.mts";
import { getCompleteMenuByRestaurant } from "../../db/queries/digitalMenu.mts";
import { restaurantIdSchema } from "./shared/schemas.mts";
import { transformMenuToFrontend, transformMenuForExport } from "./shared/transforms.mts";

export const menuCoreProcedures = {
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

  // Export menu to JSON
  export: publicProcedure
    .input(restaurantIdSchema)
    .query(async ({ input }) => {
      try {
        const menuData = await getCompleteMenuByRestaurant(input.restaurant_id);
        return transformMenuForExport(menuData);
      } catch (error) {
        console.error("Error exporting menu:", error);
        throw new Error("Failed to export menu");
      }
    }),

  // Delete entire digital menu
  deleteEntire: publicProcedure
    .input(restaurantIdSchema)
    .mutation(async ({ input }) => {
      try {
        return await db.transaction().execute(async (trx) => {
          // First get all categories for this restaurant
          const categories = await trx
            .selectFrom("category")
            .select("id")
            .where("restaurant_id", "=", input.restaurant_id)
            .execute();

          const categoryIds = categories.map(c => c.id);

          if (categoryIds.length > 0) {
            // Delete all menu items for these categories
            await trx
              .deleteFrom("item")
              .where("category_id", "in", categoryIds)
              .execute();

            // Delete all categories for this restaurant
            await trx
              .deleteFrom("category")
              .where("restaurant_id", "=", input.restaurant_id)
              .execute();
          }

          // Delete QR codes for this restaurant (digital type)
          await trx
            .deleteFrom("qr_code")
            .where("restaurant_id", "=", input.restaurant_id)
            .where("type", "=", "digital")
            .execute();

          return { 
            success: true, 
            message: "Entire digital menu deleted successfully",
            deletedCategories: categoryIds.length
          };
        });
      } catch (error) {
        console.error("Error deleting entire digital menu:", error);
        throw new Error("Failed to delete entire digital menu");
      }
    }),
};