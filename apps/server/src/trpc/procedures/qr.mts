import { z } from "zod";
import { publicProcedure } from "../index.mts";
import { db } from "../../db/index.mts";
import {
  getItemsWithDetailsByCategory,
} from "../../db/queries/digitalMenu.mts";

// QR generation schema
const qrGenerateSchema = z.object({
  restaurant_id: z.number().int().positive(),
  type: z.literal("digital"),
  setup_type: z.enum(["self", "assisted"]),
  assisted_data: z.object({
    phone_number: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
});

// Helper function to generate unique QR code
const generateQrCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `QR_${result}`;
};

export const qrProcedures = {
  // Generate QR code for digital menu
  generate: publicProcedure
    .input(qrGenerateSchema)
    .mutation(async ({ input }) => {
      try {
        return await db.transaction().execute(async (trx) => {
          // Verify restaurant exists
          const restaurant = await trx
            .selectFrom("restaurant")
            .select(["id", "name"])
            .where("id", "=", input.restaurant_id)
            .executeTakeFirst();

          if (!restaurant) {
            throw new Error("Restaurant not found");
          }

          // Generate unique QR code
          let qrCode: string;
          let attempts = 0;
          const maxAttempts = 10;

          do {
            qrCode = generateQrCode();
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
              type: "digital",
              status: input.setup_type === "self" ? "available" : "used",
              restaurant_id: input.restaurant_id,
              bound_at: new Date(),
              expires_at: null, // QR codes don't expire
              self_serve: input.setup_type === "self",
            })
            .returningAll()
            .executeTakeFirstOrThrow();

          // For assisted setup, we might want to store additional data
          // This could be extended to create user accounts, send SMS, etc.

          return {
            qr_code: qrRecord.code,
            status: qrRecord.status,
            type: qrRecord.type,
            restaurant: {
              id: restaurant.id.toString(),
              name: restaurant.name,
            },
            expires_at: qrRecord.expires_at?.toISOString() || null,
            self_serve: qrRecord.self_serve,
            menu_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu/${qrRecord.code}`,
          };
        });
      } catch (error) {
        console.error("Error generating QR code:", error);
        throw new Error("Failed to generate QR code");
      }
    }),

  // Get QR codes for restaurant
  getByRestaurant: publicProcedure
    .input(z.object({ restaurant_id: z.number().int().positive() }))
    .query(async ({ input }) => {
      try {
        const qrCodes = await db
          .selectFrom("qr_code")
          .selectAll()
          .where("restaurant_id", "=", input.restaurant_id)
          .where("type", "=", "digital")
          .orderBy("created_at", "desc")
          .execute();

        return qrCodes.map(qr => ({
          id: qr.id.toString(),
          code: qr.code,
          status: qr.status,
          type: qr.type,
          created_at: qr.created_at.toISOString(),
          bound_at: qr.bound_at?.toISOString() || null,
          expires_at: qr.expires_at?.toISOString() || null,
          self_serve: qr.self_serve,
          menu_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu/${qr.code}`,
        }));
      } catch (error) {
        console.error("Error fetching QR codes:", error);
        throw new Error("Failed to fetch QR codes");
      }
    }),

  // Update QR code status
  updateStatus: publicProcedure
    .input(z.object({
      qr_code: z.string().min(1, "QR code is required"),
      status: z.enum(["available", "used", "expired"]),
    }))
    .mutation(async ({ input }) => {
      try {
        const qrRecord = await db
          .updateTable("qr_code")
          .set({ 
            status: input.status,
            bound_at: input.status === "used" ? new Date() : undefined,
          })
          .where("code", "=", input.qr_code)
          .where("type", "=", "digital")
          .returningAll()
          .executeTakeFirstOrThrow();

        return {
          id: qrRecord.id.toString(),
          code: qrRecord.code,
          status: qrRecord.status,
          bound_at: qrRecord.bound_at?.toISOString() || null,
        };
      } catch (error) {
        console.error("Error updating QR code status:", error);
        throw new Error("Failed to update QR code status");
      }
    }),

  // Activate self-serve QR code
  activate: publicProcedure
    .input(z.object({
      qr_code: z.string().min(1, "QR code is required"),
      restaurant_data: z.object({
        name: z.string().min(1, "Restaurant name is required"),
        phone: z.string().optional(),
        address: z.string().optional(),
      }),
    }))
    .mutation(async ({ input }) => {
      try {
        return await db.transaction().execute(async (trx) => {
          // Get the QR code
          const qrRecord = await trx
            .selectFrom("qr_code")
            .selectAll()
            .where("code", "=", input.qr_code)
            .where("type", "=", "digital")
            .where("self_serve", "=", true)
            .where("status", "=", "available")
            .executeTakeFirst();

          if (!qrRecord) {
            throw new Error("QR code not found or not available for activation");
          }

          // Check if not expired
          if (qrRecord.expires_at && qrRecord.expires_at < new Date()) {
            throw new Error("QR code has expired");
          }

          // Create or update restaurant (for self-serve QR codes, restaurant might not exist yet)
          let restaurantId = qrRecord.restaurant_id;

          if (!restaurantId) {
            // Create new restaurant for self-serve activation
            // First, create a user (simplified - in real app, this would be more complex)
            const user = await trx
              .insertInto("user")
              .values({
                mobile_number: input.restaurant_data.phone || "000-000-0000",
              })
              .returningAll()
              .executeTakeFirstOrThrow();

            // Create restaurant
            const restaurant = await trx
              .insertInto("restaurant")
              .values({
                name: input.restaurant_data.name,
                mobile: input.restaurant_data.phone || "",
                address: input.restaurant_data.address || null,
                geolocation: "POINT(0 0)", // Default location
                user_id: user.id,
              })
              .returningAll()
              .executeTakeFirstOrThrow();

            restaurantId = restaurant.id;
          }

          // Update QR code to active status
          const updatedQr = await trx
            .updateTable("qr_code")
            .set({
              status: "used",
              restaurant_id: restaurantId,
              bound_at: new Date(),
              expires_at: null, // Remove expiration once activated
            })
            .where("code", "=", input.qr_code)
            .returningAll()
            .executeTakeFirstOrThrow();

          return {
            qr_code: updatedQr.code,
            status: updatedQr.status,
            restaurant_id: restaurantId.toString(),
            message: "QR code activated successfully",
            menu_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu/${updatedQr.code}`,
          };
        });
      } catch (error) {
        console.error("Error activating QR code:", error);
        throw new Error("Failed to activate QR code");
      }
    }),

  // Get QR code data for customer menu display (public endpoint)
  getQrData: publicProcedure
    .input(z.object({ qr_code: z.string().min(1, "QR code is required") }))
    .query(async ({ input }) => {
      try {
        const qrRecord = await db
          .selectFrom("qr_code")
          .leftJoin("restaurant", "qr_code.restaurant_id", "restaurant.id")
          .select([
            "qr_code.id",
            "qr_code.code",
            "qr_code.type",
            "qr_code.status", 
            "qr_code.expires_at",
            "qr_code.self_serve",
            "restaurant.id as restaurant_id",
            "restaurant.name as restaurant_name",
            "restaurant.address as restaurant_address",
            "restaurant.mobile as restaurant_phone",
            "restaurant.theme_id as restaurant_theme",
          ])
          .where("qr_code.code", "=", input.qr_code)
          .executeTakeFirst();

        if (!qrRecord) {
          throw new Error("QR code not found");
        }

        return {
          id: qrRecord.id.toString(),
          code: qrRecord.code,
          type: qrRecord.type,
          status: qrRecord.status,
          isActive: qrRecord.status === "used" && (!qrRecord.expires_at || qrRecord.expires_at > new Date()),
          needsActivation: qrRecord.self_serve && qrRecord.status === "available",
          expiresAt: qrRecord.expires_at?.toISOString() || null,
          restaurant: qrRecord.restaurant_id ? {
            id: qrRecord.restaurant_id.toString(),
            name: qrRecord.restaurant_name || "",
            address: qrRecord.restaurant_address || "",
            phone: qrRecord.restaurant_phone || "",
            theme_id: qrRecord.restaurant_theme || "minimal",
          } : null,
        };
      } catch (error) {
        console.error("Error fetching QR data:", error);
        throw new Error("Failed to fetch QR data");
      }
    }),

  // Get full menu data for customer viewing (public endpoint) 
  getMenuByQr: publicProcedure
    .input(z.object({ qr_code: z.string().min(1, "QR code is required") }))
    .query(async ({ input }) => {
      try {
        // First get QR data and restaurant info
        const qrRecord = await db
          .selectFrom("qr_code")
          .innerJoin("restaurant", "qr_code.restaurant_id", "restaurant.id")
          .select([
            "qr_code.status",
            "qr_code.expires_at", 
            "restaurant.id as restaurant_id",
            "restaurant.name as restaurant_name",
            "restaurant.address as restaurant_address",
            "restaurant.mobile as restaurant_phone",
            "restaurant.theme_id as restaurant_theme",
          ])
          .where("qr_code.code", "=", input.qr_code)
          .where("qr_code.type", "=", "digital")
          .executeTakeFirst();

        if (!qrRecord) {
          throw new Error("QR code not found or not a digital menu");
        }

        // Check if QR is active
        const isActive = qrRecord.status === "used" && (!qrRecord.expires_at || qrRecord.expires_at > new Date());
        if (!isActive) {
          throw new Error("QR code is not active");
        }

        // Get categories for this restaurant
        const categories = await db
          .selectFrom("category")
          .selectAll()
          .where("restaurant_id", "=", qrRecord.restaurant_id)
          .orderBy("sort_order", "asc")
          .execute();

        // Get items with details for each category
        const menuData = [];
        for (const category of categories) {
          const items = await getItemsWithDetailsByCategory(category.id);
          
          // Transform items to match frontend format
          const transformedItems = items.map((item: any) => ({
            id: item.id.toString(),
            name: item.name,
            price: parseFloat(item.price),
            description: item.description || undefined,
            categoryId: category.id.toString(),
            variants: (item.variants || []).map((variant: any) => ({
              id: variant.id.toString(),
              title: variant.name,
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
          }));

          menuData.push({
            category: {
              id: category.id.toString(),
              name: category.name,
              sortOrder: category.sort_order,
            },
            items: transformedItems,
          });
        }

        return {
          restaurant: {
            id: qrRecord.restaurant_id.toString(),
            name: qrRecord.restaurant_name,
            address: qrRecord.restaurant_address,
            phone: qrRecord.restaurant_phone,
            theme_id: qrRecord.restaurant_theme || "minimal",
          },
          categories: categories.map(cat => ({
            id: cat.id.toString(),
            name: cat.name,
            sortOrder: cat.sort_order,
          })),
          items: menuData.flatMap(data => data.items),
          menuData, // Full structured data
        };
      } catch (error) {
        console.error("Error fetching menu by QR:", error);
        throw new Error("Failed to fetch menu data");
      }
    }),
};