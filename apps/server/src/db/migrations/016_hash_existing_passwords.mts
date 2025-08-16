import { Kysely } from "kysely";
import bcrypt from "bcrypt";

/**
 * Migration to hash existing plain text passwords
 * This migration safely upgrades any plain text passwords to bcrypt hashes
 * while preserving existing functionality
 */

const SALT_ROUNDS = 12;

export async function up(db: Kysely<any>): Promise<void> {
  console.log("🔄 Starting migration: Hash existing plain text passwords");

  try {
    // Get all users who have passwords set
    const usersWithPasswords = await db
      .selectFrom("user")
      .select(["id", "mobile_number", "password"])
      .where("password", "is not", null)
      .where("password", "!=", "")
      .execute();

    console.log(`📊 Found ${usersWithPasswords.length} users with passwords`);

    let hashedCount = 0;
    let skippedCount = 0;

    for (const user of usersWithPasswords) {
      if (!user.password) continue;

      // Check if password is already hashed (bcrypt hashes start with $2b$)
      const isAlreadyHashed = /^\$2[abxy]?\$\d+\$/.test(user.password);

      if (isAlreadyHashed) {
        console.log(`⏭️  User ${user.mobile_number} password already hashed, skipping`);
        skippedCount++;
        continue;
      }

      // Hash the plain text password
      console.log(`🔐 Hashing password for user ${user.mobile_number}`);
      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

      // Update the user with the hashed password
      await db
        .updateTable("user")
        .set({ password: hashedPassword })
        .where("id", "=", user.id)
        .execute();

      hashedCount++;
      console.log(`✅ Successfully hashed password for user ${user.mobile_number}`);
    }

    console.log(`🎉 Migration completed successfully:`);
    console.log(`   - ${hashedCount} passwords hashed`);
    console.log(`   - ${skippedCount} passwords already hashed (skipped)`);
    console.log(`   - ${usersWithPasswords.length} total users processed`);

  } catch (error) {
    console.error("❌ Error during password hashing migration:", error);
    throw new Error(`Migration failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  console.log("⚠️  WARNING: Cannot reverse password hashing migration");
  console.log("   This migration cannot be safely reversed as we cannot");
  console.log("   convert hashed passwords back to plain text.");
  console.log("   If needed, users will need to reset their passwords.");

  // We cannot reverse this migration safely as we cannot unhash passwords
  // The migration is designed to be forward-compatible only
  throw new Error(
    "Password hashing migration cannot be reversed. " +
    "This is a security feature to prevent accidental exposure of passwords."
  );
}