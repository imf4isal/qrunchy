/**
 * Rate limiting service for tRPC procedures
 * Provides in-memory rate limiting for authentication endpoints
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  errorMessage: string;
}

class RateLimitService {
  private store: Map<string, RateLimitEntry> = new Map();

  // Rate limit configurations
  private configs = {
    otp: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3,
      errorMessage: 'Too many OTP requests. Please try again in 1 hour.'
    },
    login: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
      errorMessage: 'Too many login attempts. Please try again in 15 minutes.'
    },
    password: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3,
      errorMessage: 'Too many password operations. Please try again in 1 hour.'
    }
  };

  /**
   * Check if a request should be rate limited
   * @param key - Unique identifier for the rate limit (e.g., IP address + endpoint)
   * @param type - Type of rate limit to apply
   * @returns true if rate limit exceeded, false if allowed
   */
  checkRateLimit(key: string, type: keyof typeof this.configs): { allowed: boolean; error?: string } {
    // Skip rate limiting in development for localhost
    if (process.env.NODE_ENV === 'development' && key.includes('localhost')) {
      return { allowed: true };
    }

    const config = this.configs[type];
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      // First request or window has expired
      this.store.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return { allowed: true };
    }

    if (entry.count >= config.maxRequests) {
      // Rate limit exceeded
      console.log(`🚫 Rate limit exceeded for ${key} (${type}): ${entry.count}/${config.maxRequests}`);
      return { 
        allowed: false, 
        error: config.errorMessage 
      };
    }

    // Increment count
    entry.count++;
    this.store.set(key, entry);

    console.log(`✅ Rate limit check passed for ${key} (${type}): ${entry.count}/${config.maxRequests}`);
    return { allowed: true };
  }

  /**
   * Clean up expired entries from the store
   * Call this periodically to prevent memory leaks
   */
  cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} expired rate limit entries`);
    }
  }

  /**
   * Get remaining requests for a key and type
   * @param key - Unique identifier for the rate limit
   * @param type - Type of rate limit to check
   * @returns number of remaining requests
   */
  getRemainingRequests(key: string, type: keyof typeof this.configs): number {
    const config = this.configs[type];
    const entry = this.store.get(key);
    
    if (!entry || Date.now() > entry.resetTime) {
      return config.maxRequests;
    }

    return Math.max(0, config.maxRequests - entry.count);
  }

  /**
   * Get time until rate limit resets
   * @param key - Unique identifier for the rate limit
   * @param type - Type of rate limit to check
   * @returns seconds until reset, or 0 if not rate limited
   */
  getTimeUntilReset(key: string, type: keyof typeof this.configs): number {
    const entry = this.store.get(key);
    
    if (!entry) {
      return 0;
    }

    const now = Date.now();
    if (now > entry.resetTime) {
      return 0;
    }

    return Math.ceil((entry.resetTime - now) / 1000);
  }
}

// Create singleton instance
export const rateLimitService = new RateLimitService();

// Clean up expired entries every 5 minutes
setInterval(() => {
  rateLimitService.cleanup();
}, 5 * 60 * 1000);

/**
 * Helper function to create a rate limit key from IP and endpoint
 * @param ip - Client IP address
 * @param endpoint - Endpoint name
 * @returns rate limit key
 */
export function createRateLimitKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`;
}

/**
 * Rate limit error class
 */
export class RateLimitError extends Error {
  constructor(message: string, public retryAfter?: number) {
    super(message);
    this.name = 'RateLimitError';
  }
}