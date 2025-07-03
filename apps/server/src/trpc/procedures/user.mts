import { z } from "zod";
import { publicProcedure } from "../index.mts";
import { db } from "../../db/index.mts";

const userCreateSchema = z.object({
  mobile_number: z.string().min(1, "Mobile number is required"),
});

const userGetByMobileSchema = z.object({
  mobile_number: z.string().min(1, "Mobile number is required"),
});

const userGetByIdSchema = z.object({
  id: z.number().int().positive(),
});

export const userProcedures = {
  create: publicProcedure
    .input(userCreateSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if user already exists with this mobile number
        const existingUser = await db
          .selectFrom("user")
          .selectAll()
          .where("mobile_number", "=", input.mobile_number)
          .executeTakeFirst();

        if (existingUser) {
          // Return existing user instead of creating duplicate
          return {
            id: existingUser.id,
            mobile_number: existingUser.mobile_number,
            created_at: existingUser.created_at.toISOString(),
            updated_at: existingUser.updated_at.toISOString(),
            isExisting: true,
          };
        }

        // Create new user
        const user = await db
          .insertInto("user")
          .values({
            mobile_number: input.mobile_number,
          })
          .returningAll()
          .executeTakeFirstOrThrow();

        return {
          id: user.id,
          mobile_number: user.mobile_number,
          created_at: user.created_at.toISOString(),
          updated_at: user.updated_at.toISOString(),
          isExisting: false,
        };
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
      }
    }),

  getByMobile: publicProcedure
    .input(userGetByMobileSchema)
    .query(async ({ input }) => {
      try {
        const user = await db
          .selectFrom("user")
          .selectAll()
          .where("mobile_number", "=", input.mobile_number)
          .executeTakeFirst();

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          mobile_number: user.mobile_number,
          created_at: user.created_at.toISOString(),
          updated_at: user.updated_at.toISOString(),
        };
      } catch (error) {
        console.error("Error fetching user by mobile:", error);
        throw new Error("Failed to fetch user");
      }
    }),

  getById: publicProcedure
    .input(userGetByIdSchema)
    .query(async ({ input }) => {
      try {
        const user = await db
          .selectFrom("user")
          .selectAll()
          .where("id", "=", input.id)
          .executeTakeFirst();

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          mobile_number: user.mobile_number,
          created_at: user.created_at.toISOString(),
          updated_at: user.updated_at.toISOString(),
        };
      } catch (error) {
        console.error("Error fetching user by id:", error);
        throw new Error("Failed to fetch user");
      }
    }),
};