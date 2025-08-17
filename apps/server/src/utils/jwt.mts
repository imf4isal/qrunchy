import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';

/**
 * JWT utility functions for secure session management
 * Provides token generation, verification, and user context management
 */

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// User payload interface for JWT tokens
export interface JWTUserPayload {
  userId: number;
  mobile: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token for authenticated user
 * @param user - User information to encode in token
 * @returns JWT token string
 */
export function generateJWTToken(user: { id: number; mobile_number: string }): string {
  try {
    const payload: JWTUserPayload = {
      userId: user.id,
      mobile: user.mobile_number,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'qrunchy-platform',
      audience: 'qrunchy-users',
    });

    console.log(`🔐 JWT token generated for user ${user.mobile_number}`);
    return token;
  } catch (error) {
    console.error('❌ Error generating JWT token:', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to generate authentication token',
    });
  }
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded user payload
 */
export function verifyJWTToken(token: string): JWTUserPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'qrunchy-platform',
      audience: 'qrunchy-users',
    }) as JWTUserPayload;

    console.log(`🔍 JWT token verified for user ${decoded.mobile}`);
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('⏰ JWT token expired');
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication token has expired. Please log in again.',
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      console.log('🚫 Invalid JWT token');
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid authentication token. Please log in again.',
      });
    }

    console.error('❌ Error verifying JWT token:', error);
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication failed. Please log in again.',
    });
  }
}

/**
 * Extract JWT token from Authorization header
 * @param authHeader - Authorization header value
 * @returns JWT token string or null if not found
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) {
    return null;
  }

  // Support both "Bearer token" and "token" formats
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // If it's just the token without "Bearer " prefix
  if (authHeader.length > 20) { // JWT tokens are much longer than 20 chars
    return authHeader;
  }

  return null;
}

/**
 * Refresh a JWT token (generate new token with updated expiry)
 * @param token - Current valid JWT token
 * @returns New JWT token with extended expiry
 */
export function refreshJWTToken(token: string): string {
  try {
    // Verify current token (will throw if invalid/expired)
    const decoded = verifyJWTToken(token);
    
    // Generate new token with the same user data
    const newToken = generateJWTToken({
      id: decoded.userId,
      mobile_number: decoded.mobile,
    });

    console.log(`🔄 JWT token refreshed for user ${decoded.mobile}`);
    return newToken;
  } catch (error) {
    console.error('❌ Error refreshing JWT token:', error);
    throw error; // Re-throw the original error from verifyJWTToken
  }
}

/**
 * Check if JWT secret is properly configured
 * @returns boolean indicating if JWT is properly configured
 */
export function isJWTConfigured(): boolean {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'dev-secret-key-change-in-production') {
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️  WARNING: JWT_SECRET not set in production environment!');
      return false;
    } else {
      console.log('🔧 Using development JWT secret');
    }
  }
  return true;
}

// Validate JWT configuration on module load
isJWTConfigured();