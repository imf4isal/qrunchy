import { z } from "zod";
import { publicProcedure } from "../index.mts";
import { db } from "../../db/index.mts";
import { smsService } from "../../services/smsService.mts";

// Auth-related schemas
const loginSchema = z.object({
  mobile_number: z.string().min(1, "Mobile number is required"),
});

const userSessionSchema = z.object({
  user_id: z.number().int().positive(),
});

const sendOTPSchema = z.object({
  mobile_number: z.string().min(1, "Mobile number is required"),
});

const verifyOTPSchema = z.object({
  mobile_number: z.string().min(1, "Mobile number is required"),
  otp_code: z.string().min(1, "OTP code is required"),
});

const setPasswordSchema = z.object({
  user_id: z.number().int().positive(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginWithPasswordSchema = z.object({
  mobile_number: z.string().min(1, "Mobile number is required"),
  password: z.string().min(1, "Password is required"),
});

export const authProcedures = {
  // Login - only existing users can login
  login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
    try {
      // Check if user exists with this mobile number
      const user = await db
        .selectFrom("user")
        .selectAll()
        .where("mobile_number", "=", input.mobile_number)
        .executeTakeFirst();

      // If user doesn't exist, return error
      if (!user) {
        throw new Error(
          "User not registered. Create a menu to register automatically."
        );
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
        restaurants: restaurants.map((restaurant) => ({
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
  me: publicProcedure.input(userSessionSchema).query(async ({ input }) => {
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
        restaurants: restaurants.map((restaurant) => ({
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
  logout: publicProcedure.mutation(async () => {
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

  // Send OTP to mobile number
  sendOTP: publicProcedure.input(sendOTPSchema).mutation(async ({ input }) => {
    try {
      const { mobile_number } = input;

      // Check rate limiting - max 3 OTP requests per hour per mobile number
      const hourAgo = new Date();
      hourAgo.setHours(hourAgo.getHours() - 1);

      const recentOTPs = await db
        .selectFrom("otp_verification")
        .selectAll()
        .where("mobile_number", "=", mobile_number)
        .where("created_at", ">", hourAgo)
        .execute();

      if (recentOTPs.length >= 3) {
        throw new Error("Too many OTP requests. Please try again after an hour.");
      }

      // Generate OTP
      const otpCode = smsService.generateOTP();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5); // Expires in 5 minutes

      // Save OTP to database
      await db
        .insertInto("otp_verification")
        .values({
          mobile_number,
          otp_code: otpCode,
          expires_at: expiresAt,
          attempts: 0,
        })
        .execute();

      // Send SMS
      const smsResult = await smsService.sendOTP(mobile_number, otpCode);

      if (!smsResult.success) {
        console.error("Failed to send SMS:", smsResult.error);
        throw new Error("Failed to send OTP. Please try again.");
      }

      console.log(`📱 OTP sent to ${mobile_number}: ${otpCode}`);

      return {
        success: true,
        message: "OTP sent successfully",
        expires_in_minutes: 5,
      };
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  }),

  // Verify OTP code or master password
  verifyOTP: publicProcedure.input(verifyOTPSchema).mutation(async ({ input }) => {
    try {
      const { mobile_number, otp_code } = input;

      // Check if it's the master password
      if (smsService.isMasterPassword(otp_code)) {
        console.log(`🔑 Master password used for ${mobile_number}`);
        return {
          success: true,
          message: "Verification successful",
          verified: true,
        };
      }

      // Find the most recent OTP for this mobile number
      const otpRecord = await db
        .selectFrom("otp_verification")
        .selectAll()
        .where("mobile_number", "=", mobile_number)
        .where("verified_at", "is", null)
        .orderBy("created_at", "desc")
        .executeTakeFirst();

      if (!otpRecord) {
        throw new Error("No OTP found. Please request a new one.");
      }

      // Check if OTP has expired
      if (otpRecord.expires_at < new Date()) {
        throw new Error("OTP has expired. Please request a new one.");
      }

      // Check attempts limit
      if (otpRecord.attempts >= 5) {
        throw new Error("Too many failed attempts. Please request a new OTP.");
      }

      // Increment attempts
      await db
        .updateTable("otp_verification")
        .set({ attempts: otpRecord.attempts + 1 })
        .where("id", "=", otpRecord.id)
        .execute();

      // Verify OTP code
      if (otpRecord.otp_code !== otp_code) {
        throw new Error("Invalid OTP code. Please try again.");
      }

      // Mark as verified
      await db
        .updateTable("otp_verification")
        .set({ verified_at: new Date() })
        .where("id", "=", otpRecord.id)
        .execute();

      console.log(`✅ OTP verified for ${mobile_number}`);

      return {
        success: true,
        message: "OTP verified successfully",
        verified: true,
      };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }),

  // Set password for existing user
  setPassword: publicProcedure.input(setPasswordSchema).mutation(async ({ input }) => {
    try {
      const { user_id, password } = input;

      // Update user with password
      await db
        .updateTable("user")
        .set({ password })
        .where("id", "=", user_id)
        .execute();

      console.log(`🔐 Password set for user ${user_id}`);

      return {
        success: true,
        message: "Password set successfully",
      };
    } catch (error) {
      console.error("Error setting password:", error);
      throw new Error("Failed to set password");
    }
  }),

  // Login with mobile number and password
  loginWithPassword: publicProcedure.input(loginWithPasswordSchema).mutation(async ({ input }) => {
    try {
      const { mobile_number, password } = input;

      // Find user with mobile number and password
      const user = await db
        .selectFrom("user")
        .selectAll()
        .where("mobile_number", "=", mobile_number)
        .where("password", "=", password)
        .executeTakeFirst();

      if (!user) {
        throw new Error("Invalid mobile number or password");
      }

      // Get user's restaurants
      const restaurants = await db
        .selectFrom("restaurant")
        .selectAll()
        .where("user_id", "=", user.id)
        .where("is_active", "=", true)
        .orderBy("created_at", "desc")
        .execute();

      console.log(`🔐 Password login successful for ${mobile_number}`);

      return {
        user: {
          id: user.id,
          mobile_number: user.mobile_number,
          created_at: user.created_at.toISOString(),
          updated_at: user.updated_at.toISOString(),
        },
        restaurants: restaurants.map((restaurant) => ({
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
      console.error("Error during password login:", error);
      throw error;
    }
  }),
};
