import { z } from "zod";
import { publicProcedure, withRateLimit, authenticatedProcedure } from "../index.mts";
import { db } from "../../db/index.mts";
import { smsService } from "../../services/smsService.mts";
import { hashPassword, safeComparePassword } from "../../utils/password.mts";
import { generateJWTToken } from "../../utils/jwt.mts";

// Enhanced validation schemas with better security
const loginSchema = z.object({
  mobile_number: z
    .string()
    .min(1, "Mobile number is required")
    .max(25, "Mobile number too long")
    .regex(/^[\+]?[0-9][\d\s\-]{0,20}$/, "Invalid mobile number format")
    .transform((val) => val.trim()),
});

const userSessionSchema = z.object({
  user_id: z.number().int().positive().max(2147483647), // Max int32
});

const sendOTPSchema = z.object({
  mobile_number: z
    .string()
    .min(1, "Mobile number is required")
    .max(25, "Mobile number too long")
    .regex(/^[\+]?[0-9][\d\s\-]{0,20}$/, "Invalid mobile number format")
    .transform((val) => val.trim()),
});

const verifyOTPSchema = z.object({
  mobile_number: z
    .string()
    .min(1, "Mobile number is required")
    .max(25, "Mobile number too long")
    .regex(/^[\+]?[0-9][\d\s\-]{0,20}$/, "Invalid mobile number format")
    .transform((val) => val.trim()),
  otp_code: z
    .string()
    .length(6, "OTP code must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP code must contain only digits")
    .transform((val) => val.trim()),
  auto_create_user: z.boolean().optional().default(false),
});

const setPasswordSchema = z.object({
  user_id: z.number().int().positive().max(2147483647),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password too long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number")
    .transform((val) => val.trim()),
});

const loginWithPasswordSchema = z.object({
  mobile_number: z
    .string()
    .min(1, "Mobile number is required")
    .max(25, "Mobile number too long")
    .regex(/^[\+]?[0-9][\d\s\-]{0,20}$/, "Invalid mobile number format")
    .transform((val) => val.trim()),
  password: z
    .string()
    .min(1, "Password is required")
    .max(100, "Password too long")
    .transform((val) => val.trim()),
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

      // Generate JWT token for the authenticated user
      const token = generateJWTToken(user);

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
        // NEW: Include JWT token in response
        token,
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
  sendOTP: publicProcedure
    .use(withRateLimit('otp'))
    .input(sendOTPSchema)
    .mutation(async ({ input }) => {
    try {
      const { mobile_number } = input;
      console.log(`🎯 [AUTH] sendOTP called for: ${mobile_number}`);

      // Check rate limiting - max 10 OTP requests per hour per mobile number
      // Skip rate limiting in development mode
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      if (isDevelopment) {
        console.log(`🚫 [AUTH] Rate limiting bypassed for development environment`);
      } else {
        const hourAgo = new Date();
        hourAgo.setHours(hourAgo.getHours() - 1);

        const recentOTPs = await db
          .selectFrom("otp_verification")
          .selectAll()
          .where("mobile_number", "=", mobile_number)
          .where("created_at", ">", hourAgo)
          .execute();

        console.log(`🔢 [AUTH] Recent OTPs in last hour: ${recentOTPs.length}/10`);

        if (recentOTPs.length >= 10) {
          console.warn(`🚫 [AUTH] Rate limit exceeded for ${mobile_number}`);
          throw new Error(
            "Too many OTP requests. Please try again after an hour."
          );
        }
      }

      // Generate OTP
      const otpCode = smsService.generateOTP();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5); // Expires in 5 minutes

      console.log(`🎲 [AUTH] Generated OTP: ${otpCode} (expires at ${expiresAt.toISOString()})`);

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

      console.log(`💾 [AUTH] OTP saved to database for ${mobile_number}`);

      // Send SMS
      console.log(`📤 [AUTH] Calling SMS service...`);
      const smsResult = await smsService.sendOTP(mobile_number, otpCode);

      console.log(`📥 [AUTH] SMS service result:`, smsResult);

      if (!smsResult.success) {
        console.error("❌ [AUTH] Failed to send SMS:", smsResult.error);
        throw new Error("Failed to send OTP. Please try again.");
      }

      console.log(`✅ [AUTH] OTP process completed for ${mobile_number}: ${otpCode}`);

      return {
        success: true,
        message: "OTP sent successfully",
        expires_in_minutes: 5,
      };
    } catch (error) {
      console.error("💥 [AUTH] Error in sendOTP:", error);
      throw error;
    }
  }),

  // Verify OTP code or master password
  verifyOTP: publicProcedure
    .input(verifyOTPSchema)
    .mutation(async ({ input }) => {
      try {
        const { mobile_number, otp_code, auto_create_user } = input;
        let user = null;

        // Check if it's the master password
        if (smsService.isMasterPassword(otp_code)) {
          console.log(`🔑 Master password used for ${mobile_number}`);
          console.log(`🔄 auto_create_user parameter value: ${auto_create_user}`);
          
          // If auto_create_user is enabled, check if user exists and create if needed
          if (auto_create_user) {
            console.log('🔍 Checking if user exists for auto-creation...');
            user = await db
              .selectFrom("user")
              .selectAll()
              .where("mobile_number", "=", mobile_number)
              .executeTakeFirst();

            if (!user) {
              // Create new user account
              user = await db
                .insertInto("user")
                .values({
                  mobile_number,
                  is_verified: true,
                })
                .returningAll()
                .executeTakeFirstOrThrow();
              
              console.log(`👤 Auto-created user account for ${mobile_number} via master password`);
            }
          }
          
          return {
            success: true,
            message: "Verification successful",
            verified: true,
            user: user ? {
              id: user.id,
              mobile_number: user.mobile_number,
              created_at: user.created_at.toISOString(),
              updated_at: user.updated_at.toISOString(),
            } : undefined,
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
          throw new Error(
            "Too many failed attempts. Please request a new OTP."
          );
        }

        // Increment attempts
        await db
          .updateTable("otp_verification")
          .set({ attempts: otpRecord.attempts + 1 })
          .where("id", "=", otpRecord.id)
          .execute();

        // Debug OTP verification
        console.log('🔍 [DEBUG] OTP Verification Debug:');
        console.log('   - Database OTP:', JSON.stringify(otpRecord.otp_code));
        console.log('   - Input OTP:', JSON.stringify(otp_code));
        console.log('   - Database OTP type:', typeof otpRecord.otp_code);
        console.log('   - Input OTP type:', typeof otp_code);
        console.log('   - Length DB:', otpRecord.otp_code?.length);
        console.log('   - Length Input:', otp_code?.length);
        console.log('   - Strict equality:', otpRecord.otp_code === otp_code);
        console.log('   - Trimmed comparison:', otpRecord.otp_code?.trim() === otp_code?.trim());

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

        // If auto_create_user is enabled, check if user exists and create if needed
        if (auto_create_user) {
          user = await db
            .selectFrom("user")
            .selectAll()
            .where("mobile_number", "=", mobile_number)
            .executeTakeFirst();

          if (!user) {
            // Create new user account
            user = await db
              .insertInto("user")
              .values({
                mobile_number,
                is_verified: true,
              })
              .returningAll()
              .executeTakeFirstOrThrow();
            
            console.log(`👤 Auto-created user account for ${mobile_number} via OTP verification`);
          }
        }

        return {
          success: true,
          message: "OTP verified successfully",
          verified: true,
          user: user ? {
            id: user.id,
            mobile_number: user.mobile_number,
            created_at: user.created_at.toISOString(),
            updated_at: user.updated_at.toISOString(),
          } : undefined,
        };
      } catch (error) {
        console.error("Error verifying OTP:", error);
        throw error;
      }
    }),

  // Set password for existing user
  setPassword: publicProcedure
    .use(withRateLimit('password'))
    .input(setPasswordSchema)
    .mutation(async ({ input }) => {
      try {
        const { user_id, password } = input;

        // Hash the password before storing
        const hashedPassword = await hashPassword(password);

        // Update user with hashed password
        await db
          .updateTable("user")
          .set({ password: hashedPassword })
          .where("id", "=", user_id)
          .execute();

        console.log(`🔐 Password set and hashed for user ${user_id}`);

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
  loginWithPassword: publicProcedure
    .use(withRateLimit('login'))
    .input(loginWithPasswordSchema)
    .mutation(async ({ input }) => {
      try {
        const { mobile_number, password } = input;

        // Find user by mobile number first
        const user = await db
          .selectFrom("user")
          .selectAll()
          .where("mobile_number", "=", mobile_number)
          .executeTakeFirst();

        if (!user || !user.password) {
          throw new Error("Invalid mobile number or password");
        }

        // Verify password using safe comparison (supports both plain text and hashed)
        const isPasswordValid = await safeComparePassword(password, user.password);

        if (!isPasswordValid) {
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

        // Generate JWT token for the authenticated user
        const token = generateJWTToken(user);

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
          // NEW: Include JWT token in response
          token,
        };
      } catch (error) {
        console.error("Error during password login:", error);
        throw error;
      }
    }),

  // Validate JWT token and return current user info
  validateToken: authenticatedProcedure
    .query(async ({ ctx }) => {
      try {
        // The JWT middleware has already verified the token and added user to context
        const { user } = ctx;

        if (!user) {
          throw new Error("User context not found");
        }

        // Fetch fresh user data from database
        const dbUser = await db
          .selectFrom("user")
          .selectAll()
          .where("id", "=", user.userId)
          .executeTakeFirst();

        if (!dbUser) {
          throw new Error("User not found in database");
        }

        // Get user's restaurants
        const restaurants = await db
          .selectFrom("restaurant")
          .selectAll()
          .where("user_id", "=", user.userId)
          .where("is_active", "=", true)
          .orderBy("created_at", "desc")
          .execute();

        console.log(`✅ Token validated successfully for user ${user.mobile}`);

        return {
          user: {
            id: dbUser.id,
            mobile_number: dbUser.mobile_number,
            created_at: dbUser.created_at.toISOString(),
            updated_at: dbUser.updated_at.toISOString(),
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
          isValid: true,
        };
      } catch (error) {
        console.error("Error validating token:", error);
        throw error;
      }
    }),
};
