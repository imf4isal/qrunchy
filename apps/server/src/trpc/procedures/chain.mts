import { z } from "zod";
import { sql } from "kysely";
import { publicProcedure } from "../index.mts";
import { db } from "../../db/index.mts";

const chainCreateSchema = z.object({
  name: z.string().min(1, "Chain name is required"),
  description: z.string().optional(),
  user_id: z.number().int().positive(),
});

const chainUpdateSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Chain name is required").optional(),
  description: z.string().optional(),
});

const chainGetByUserSchema = z.object({
  user_id: z.number().int().positive(),
});

const chainGetByIdSchema = z.object({
  id: z.number().int().positive(),
});

const chainDeleteSchema = z.object({
  id: z.number().int().positive(),
});

export const chainProcedures = {
  create: publicProcedure
    .input(chainCreateSchema)
    .mutation(async ({ input }) => {
      try {
        console.log("🔗 Chain creation request received:", {
          name: input.name,
          user_id: input.user_id,
          description: input.description
        });

        // Verify user exists
        const user = await db
          .selectFrom("user")
          .select("id")
          .where("id", "=", input.user_id)
          .executeTakeFirst();

        if (!user) {
          throw new Error("User not found");
        }

        // Create chain (group_res with type 'chain')
        const chain = await db
          .insertInto("group_res")
          .values({
            name: input.name,
            description: input.description || null,
            geolocation: sql`POINT(0, 0)`, // Default location
            user_id: input.user_id,
            type: "chain",
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        console.log("✅ Chain created successfully:", {
          id: chain.id,
          name: chain.name,
          type: chain.type,
          user_id: chain.user_id,
          created_at: chain.created_at
        });

        return {
          id: chain.id,
          name: chain.name,
          description: chain.description,
          user_id: chain.user_id,
          type: chain.type,
          created_at: chain.created_at.toISOString(),
          updated_at: chain.updated_at.toISOString(),
          is_active: chain.is_active,
        };
      } catch (error) {
        console.error("Error creating chain:", error);
        throw new Error("Failed to create chain");
      }
    }),

  getByUser: publicProcedure
    .input(chainGetByUserSchema)
    .query(async ({ input }) => {
      try {
        const chains = await db
          .selectFrom("group_res")
          .selectAll()
          .where("user_id", "=", input.user_id)
          .where("type", "=", "chain")
          .where("is_active", "=", true)
          .orderBy("created_at", "desc")
          .execute();

        return chains.map(chain => ({
          id: chain.id,
          name: chain.name,
          description: chain.description,
          user_id: chain.user_id,
          type: chain.type,
          created_at: chain.created_at.toISOString(),
          updated_at: chain.updated_at.toISOString(),
          is_active: chain.is_active,
        }));
      } catch (error) {
        console.error("Error fetching chains by user:", error);
        throw new Error("Failed to fetch chains");
      }
    }),

  getById: publicProcedure
    .input(chainGetByIdSchema)
    .query(async ({ input }) => {
      try {
        const chain = await db
          .selectFrom("group_res")
          .selectAll()
          .where("id", "=", input.id)
          .where("type", "=", "chain")
          .where("is_active", "=", true)
          .executeTakeFirst();

        if (!chain) {
          return null;
        }

        return {
          id: chain.id,
          name: chain.name,
          description: chain.description,
          user_id: chain.user_id,
          type: chain.type,
          created_at: chain.created_at.toISOString(),
          updated_at: chain.updated_at.toISOString(),
          is_active: chain.is_active,
        };
      } catch (error) {
        console.error("Error fetching chain by id:", error);
        throw new Error("Failed to fetch chain");
      }
    }),

  update: publicProcedure
    .input(chainUpdateSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;

        const updatedChain = await db
          .updateTable("group_res")
          .set(updateData)
          .where("id", "=", id)
          .where("type", "=", "chain")
          .where("is_active", "=", true)
          .returningAll()
          .executeTakeFirstOrThrow();

        return {
          id: updatedChain.id,
          name: updatedChain.name,
          description: updatedChain.description,
          user_id: updatedChain.user_id,
          type: updatedChain.type,
          created_at: updatedChain.created_at.toISOString(),
          updated_at: updatedChain.updated_at.toISOString(),
          is_active: updatedChain.is_active,
        };
      } catch (error) {
        console.error("Error updating chain:", error);
        throw new Error("Failed to update chain");
      }
    }),

  delete: publicProcedure
    .input(chainDeleteSchema)
    .mutation(async ({ input }) => {
      try {
        console.log("🗑️ Chain deletion request received:", { id: input.id });

        // First check if chain exists
        const existingChain = await db
          .selectFrom("group_res")
          .select(["id", "name", "is_active"])
          .where("id", "=", input.id)
          .where("type", "=", "chain")
          .executeTakeFirst();

        if (!existingChain) {
          throw new Error("Chain not found");
        }

        if (!existingChain.is_active) {
          throw new Error("Chain is already deleted");
        }

        console.log("📊 Chain found:", existingChain);

        // Check if chain has any restaurants
        const restaurantsCount = await db
          .selectFrom("restaurant")
          .select(({ fn }) => fn.countAll().as("count"))
          .where("group_res_id", "=", input.id)
          .where("is_active", "=", true)
          .executeTakeFirst();

        console.log("📊 Restaurants count:", restaurantsCount);

        if (restaurantsCount && Number(restaurantsCount.count) > 0) {
          throw new Error("Cannot delete chain with active restaurants. Please remove restaurants from chain first.");
        }

        // Soft delete the chain
        const deletedChain = await db
          .updateTable("group_res")
          .set({ is_active: false })
          .where("id", "=", input.id)
          .where("type", "=", "chain")
          .where("is_active", "=", true)
          .returningAll()
          .executeTakeFirst();

        if (!deletedChain) {
          throw new Error("Failed to delete chain - no rows affected");
        }

        console.log("✅ Chain deleted successfully:", {
          id: deletedChain.id,
          name: deletedChain.name,
          is_active: deletedChain.is_active
        });

        return {
          id: deletedChain.id,
          name: deletedChain.name,
          is_active: deletedChain.is_active,
        };
      } catch (error) {
        console.error("❌ Error deleting chain:", error);
        throw new Error(`Failed to delete chain: ${error.message}`);
      }
    }),

  getWithRestaurants: publicProcedure
    .input(chainGetByUserSchema)
    .query(async ({ input }) => {
      try {
        // Get chains with their restaurants
        const chainsWithRestaurants = await db
          .selectFrom("group_res")
          .leftJoin("restaurant", "restaurant.group_res_id", "group_res.id")
          .select([
            "group_res.id as chain_id",
            "group_res.name as chain_name",
            "group_res.description as chain_description",
            "group_res.created_at as chain_created_at",
            "restaurant.id as restaurant_id",
            "restaurant.name as restaurant_name",
            "restaurant.mobile as restaurant_mobile",
            "restaurant.address as restaurant_address",
            "restaurant.theme_id as restaurant_theme_id",
            "restaurant.created_at as restaurant_created_at",
          ])
          .where("group_res.user_id", "=", input.user_id)
          .where("group_res.type", "=", "chain")
          .where("group_res.is_active", "=", true)
          .where((eb) => eb.or([
            eb("restaurant.is_active", "=", true),
            eb("restaurant.id", "is", null)
          ]))
          .orderBy("group_res.created_at", "desc")
          .orderBy("restaurant.created_at", "desc")
          .execute();

        // Group restaurants by chain
        const chainsMap = new Map();
        
        chainsWithRestaurants.forEach(row => {
          if (!chainsMap.has(row.chain_id)) {
            chainsMap.set(row.chain_id, {
              id: row.chain_id,
              name: row.chain_name,
              description: row.chain_description,
              created_at: row.chain_created_at.toISOString(),
              restaurants: []
            });
          }
          
          if (row.restaurant_id) {
            chainsMap.get(row.chain_id).restaurants.push({
              id: row.restaurant_id,
              name: row.restaurant_name,
              mobile: row.restaurant_mobile,
              address: row.restaurant_address,
              theme_id: row.restaurant_theme_id,
              created_at: row.restaurant_created_at.toISOString(),
            });
          }
        });

        return Array.from(chainsMap.values());
      } catch (error) {
        console.error("Error fetching chains with restaurants:", error);
        throw new Error("Failed to fetch chains with restaurants");
      }
    }),
};