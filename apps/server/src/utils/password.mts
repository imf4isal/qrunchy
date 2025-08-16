import bcrypt from 'bcrypt';

/**
 * Password utility functions for secure password handling
 * Uses bcrypt with salt rounds of 12 for strong security
 */

const SALT_ROUNDS = 12;

/**
 * Hash a plain text password using bcrypt
 * @param plainTextPassword - The plain text password to hash
 * @returns Promise<string> - The hashed password
 */
export async function hashPassword(plainTextPassword: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
    console.log('🔐 Password hashed successfully');
    return hashedPassword;
  } catch (error) {
    console.error('❌ Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Compare a plain text password with a hashed password
 * @param plainTextPassword - The plain text password to verify
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
export async function comparePassword(
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    console.log(`🔍 Password comparison result: ${isMatch ? 'MATCH' : 'NO MATCH'}`);
    return isMatch;
  } catch (error) {
    console.error('❌ Error comparing password:', error);
    return false;
  }
}

/**
 * Check if a password is already hashed (bcrypt hashes start with $2b$)
 * @param password - The password to check
 * @returns boolean - True if password appears to be hashed, false if plain text
 */
export function isPasswordHashed(password: string): boolean {
  // Bcrypt hashes start with $2a$, $2b$, $2x$, or $2y$ followed by cost and salt
  const bcryptRegex = /^\$2[abxy]?\$\d+\$/;
  return bcryptRegex.test(password);
}

/**
 * Safely compare password supporting both plain text (legacy) and hashed passwords
 * This function maintains backward compatibility during migration
 * @param inputPassword - The password provided by user
 * @param storedPassword - The password stored in database (may be plain text or hashed)
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
export async function safeComparePassword(
  inputPassword: string,
  storedPassword: string
): Promise<boolean> {
  try {
    // Check if stored password is already hashed
    if (isPasswordHashed(storedPassword)) {
      // Use bcrypt comparison for hashed passwords
      return await comparePassword(inputPassword, storedPassword);
    } else {
      // Use direct comparison for plain text passwords (legacy support)
      console.log('⚠️  WARNING: Comparing plain text password - consider migrating to hashed passwords');
      return inputPassword === storedPassword;
    }
  } catch (error) {
    console.error('❌ Error in safe password comparison:', error);
    return false;
  }
}

/**
 * Upgrade a plain text password to hashed password
 * Used during gradual migration from plain text to hashed passwords
 * @param plainTextPassword - The plain text password to upgrade
 * @returns Promise<string> - The hashed password
 */
export async function upgradePassword(plainTextPassword: string): Promise<string> {
  console.log('🔄 Upgrading plain text password to hashed password');
  return await hashPassword(plainTextPassword);
}