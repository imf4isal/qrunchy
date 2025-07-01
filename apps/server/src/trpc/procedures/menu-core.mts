import { z } from "zod";
import { publicProcedure, router } from "../index.mts";
import { db } from "../../db/index.mts";
import { getCompleteMenuByRestaurant } from "../../db/queries/digitalMenu.mts";
import { restaurantIdSchema } from "./shared/schemas.mts";
import { transformMenuToFrontend, transformMenuForExport } from "./shared/transforms.mts";

export const menuCoreProcedures = router({
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
});