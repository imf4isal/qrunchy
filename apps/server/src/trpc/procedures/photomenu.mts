import { z } from "zod";
import { publicProcedure } from "../index.mjs";
import { db } from "../../db/index.mjs";
import {
  getPhotoMenuByRestaurant,
  getPhotoMenuByQrCode,
  createPhotoMenu,
  createMultiplePhotoMenus,
  updatePhotoMenu,
  updatePhotoMenuSortOrder,
  deletePhotoMenu,
  deleteAllPhotoMenusForRestaurant,
  getPhotoMenuCount,
} from "../../db/queries/photoMenu.mjs";

// Validation schemas
const photoMenuCreateSchema = z.object({
  restaurant_id: z.number().int().positive(),
  image_url: z.string().min(1, "Image URL cannot be empty"),
  sort_order: z.number().int().optional(),
});

const photoMenuCreateMultipleSchema = z.object({
  restaurant_id: z.number().int().positive(),
  image_urls: z.array(z.string().min(1, "Image URL cannot be empty")).min(1).max(10),
});

const photoMenuUpdateSchema = z.object({
  id: z.number().int().positive(),
  image_url: z.string().url("Invalid image URL").optional(),
  sort_order: z.number().int().optional(),
});

const photoMenuGetByRestaurantSchema = z.object({
  restaurant_id: z.number().int().positive(),
});

const photoMenuGetByQrSchema = z.object({
  qr_code: z.string().min(1, "QR code is required"),
});

const photoMenuDeleteSchema = z.object({
  id: z.number().int().positive(),
});

const photoMenuSortOrderSchema = z.object({
  updates: z.array(z.object({
    id: z.number().int().positive(),
    sort_order: z.number().int(),
  })).min(1),
});

const qrGeneratePhotoSchema = z.object({
  restaurant_id: z.number().int().positive(),
  setup_type: z.enum(["self", "assisted"]),
  assisted_data: z.object({
    phone_number: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
});

const qrGetByRestaurantSchema = z.object({
  restaurant_id: z.number().int().positive(),
});

// Helper function to generate unique photo QR code
const generatePhotoQrCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `photo_${result}`;
};

export const photoMenuProcedures = {
  // Get photo menu by restaurant ID
  getByRestaurant: publicProcedure
    .input(photoMenuGetByRestaurantSchema)
    .query(async ({ input }) => {
      try {
        const photos = await getPhotoMenuByRestaurant(input.restaurant_id);
        return { photos };
      } catch (error) {
        console.error("Error fetching photo menu:", error);
        throw new Error("Failed to fetch photo menu");
      }
    }),

  // Get photo menu by QR code (for customer view)
  getByQrCode: publicProcedure
    .input(photoMenuGetByQrSchema)
    .query(async ({ input }) => {
      try {
        const photos = await getPhotoMenuByQrCode(input.qr_code);
        return { photos };
      } catch (error) {
        console.error("Error fetching photo menu by QR:", error);
        throw new Error("Photo menu not found for this QR code");
      }
    }),

  // Create single photo menu entry
  create: publicProcedure
    .input(photoMenuCreateSchema)
    .mutation(async ({ input }) => {
      try {
        // Verify restaurant exists
        const restaurant = await db
          .selectFrom("restaurant")
          .select("id")
          .where("id", "=", input.restaurant_id)
          .executeTakeFirst();

        if (!restaurant) {
          throw new Error("Restaurant not found");
        }

        const photo = await createPhotoMenu(input);
        return { photo };
      } catch (error) {
        console.error("Error creating photo menu:", error);
        throw new Error("Failed to create photo menu entry");
      }
    }),

  // Create multiple photo menu entries
  createMultiple: publicProcedure
    .input(photoMenuCreateMultipleSchema)
    .mutation(async ({ input }) => {
      try {
        // Verify restaurant exists
        const restaurant = await db
          .selectFrom("restaurant")
          .select("id")
          .where("id", "=", input.restaurant_id)
          .executeTakeFirst();

        if (!restaurant) {
          throw new Error("Restaurant not found");
        }

        const photos = await createMultiplePhotoMenus(input.restaurant_id, input.image_urls);
        return { photos };
      } catch (error) {
        console.error("Error creating multiple photo menus:", error);
        throw new Error("Failed to create photo menu entries");
      }
    }),

  // Update photo menu entry
  update: publicProcedure
    .input(photoMenuUpdateSchema)
    .mutation(async ({ input }) => {
      try {
        // Verify photo exists
        const existingPhoto = await db
          .selectFrom("photo_menu")
          .select(["id", "restaurant_id"])
          .where("id", "=", input.id)
          .executeTakeFirst();

        if (!existingPhoto) {
          throw new Error("Photo menu entry not found");
        }

        const { id, ...updateData } = input;
        const photo = await updatePhotoMenu(id, updateData);
        return { photo };
      } catch (error) {
        console.error("Error updating photo menu:", error);
        throw new Error("Failed to update photo menu entry");
      }
    }),

  // Update sort order for multiple photos
  updateSortOrder: publicProcedure
    .input(photoMenuSortOrderSchema)
    .mutation(async ({ input }) => {
      try {
        await updatePhotoMenuSortOrder(input.updates);
        return { success: true };
      } catch (error) {
        console.error("Error updating sort order:", error);
        throw new Error("Failed to update sort order");
      }
    }),

  // Delete photo menu entry
  delete: publicProcedure
    .input(photoMenuDeleteSchema)
    .mutation(async ({ input }) => {
      try {
        const photo = await deletePhotoMenu(input.id);
        return { photo };
      } catch (error) {
        console.error("Error deleting photo menu:", error);
        throw new Error("Failed to delete photo menu entry");
      }
    }),

  // Delete all photo menus for a restaurant
  deleteAll: publicProcedure
    .input(photoMenuGetByRestaurantSchema)
    .mutation(async ({ input }) => {
      try {
        await deleteAllPhotoMenusForRestaurant(input.restaurant_id);
        return { success: true };
      } catch (error) {
        console.error("Error deleting all photo menus:", error);
        throw new Error("Failed to delete photo menus");
      }
    }),

  // Get photo menu count for restaurant
  getCount: publicProcedure
    .input(photoMenuGetByRestaurantSchema)
    .query(async ({ input }) => {
      try {
        const count = await getPhotoMenuCount(input.restaurant_id);
        return { count };
      } catch (error) {
        console.error("Error getting photo menu count:", error);
        throw new Error("Failed to get photo menu count");
      }
    }),

  // Generate QR code for photo menu
  generateQr: publicProcedure
    .input(qrGeneratePhotoSchema)
    .mutation(async ({ input }) => {
      try {
        return await db.transaction().execute(async (trx) => {
          // Verify restaurant exists and has photo menu
          const restaurant = await trx
            .selectFrom("restaurant")
            .select(["id", "name", "mobile", "address"])
            .where("id", "=", input.restaurant_id)
            .executeTakeFirst();

          if (!restaurant) {
            throw new Error("Restaurant not found");
          }

          // Check if restaurant has any photo menu entries
          const photoCount = await trx
            .selectFrom("photo_menu")
            .select(({ fn }) => fn.countAll().as("count"))
            .where("restaurant_id", "=", input.restaurant_id)
            .executeTakeFirst();

          if (!photoCount || Number(photoCount.count) === 0) {
            throw new Error("Restaurant must have at least one photo menu entry to generate QR code");
          }

          // Generate unique QR code
          let qrCode: string;
          let attempts = 0;
          const maxAttempts = 10;

          do {
            qrCode = generatePhotoQrCode();
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
              type: "photo",
              status: input.setup_type === "self" ? "available" : "used",
              restaurant_id: input.restaurant_id,
              bound_at: new Date(),
              expires_at: input.setup_type === "self" 
                ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
                : null,
              self_serve: input.setup_type === "self",
            })
            .returningAll()
            .executeTakeFirstOrThrow();

          return {
            qr_code: qrRecord.code,
            status: qrRecord.status,
            type: qrRecord.type,
            restaurant: {
              id: restaurant.id.toString(),
              name: restaurant.name,
              mobile: restaurant.mobile,
              address: restaurant.address,
            },
            expires_at: qrRecord.expires_at?.toISOString() || null,
            self_serve: qrRecord.self_serve,
            menu_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu/${qrRecord.code}`,
          };
        });
      } catch (error) {
        console.error("Error generating photo QR code:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to generate QR code");
      }
    }),

  // Get QR codes for a restaurant's photo menu
  getQrByRestaurant: publicProcedure
    .input(qrGetByRestaurantSchema)
    .query(async ({ input }) => {
      try {
        const qrCodes = await db
          .selectFrom("qr_code")
          .select(["id", "code", "type", "status", "restaurant_id", "bound_at", "expires_at", "self_serve"])
          .where("restaurant_id", "=", input.restaurant_id)
          .where("type", "=", "photo")
          .orderBy("bound_at", "desc")
          .execute();

        return qrCodes.map(qr => ({
          ...qr,
          menu_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu/${qr.code}`,
          expires_at: qr.expires_at?.toISOString() || null,
        }));
      } catch (error) {
        console.error("Error fetching photo menu QR codes:", error);
        throw new Error("Failed to fetch QR codes");
      }
    }),
};