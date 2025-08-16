import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Rate limiting middleware for authentication endpoints
 * Protects against brute force attacks and abuse
 */

/**
 * Rate limiter for OTP requests
 * Allows 3 OTP requests per hour per IP address
 */
export const otpRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 OTP requests per windowMs
  message: {
    error: 'Too many OTP requests',
    message: 'You have exceeded the maximum number of OTP requests. Please try again in 1 hour.',
    retryAfter: 3600 // seconds
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    console.log(`🚫 OTP rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many OTP requests',
      message: 'You have exceeded the maximum number of OTP requests. Please try again in 1 hour.',
      retryAfter: 3600
    });
  },
  skip: (req: Request) => {
    // Skip rate limiting for localhost in development
    if (process.env.NODE_ENV === 'development' && 
        (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip?.includes('localhost'))) {
      return true;
    }
    return false;
  }
});

/**
 * Rate limiter for login attempts
 * Allows 5 login attempts per 15 minutes per IP address
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    error: 'Too many login attempts',
    message: 'You have exceeded the maximum number of login attempts. Please try again in 15 minutes.',
    retryAfter: 900 // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.log(`🚫 Login rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many login attempts',
      message: 'You have exceeded the maximum number of login attempts. Please try again in 15 minutes.',
      retryAfter: 900
    });
  },
  skip: (req: Request) => {
    // Skip rate limiting for localhost in development
    if (process.env.NODE_ENV === 'development' && 
        (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip?.includes('localhost'))) {
      return true;
    }
    return false;
  }
});

/**
 * Rate limiter for password reset/setup operations
 * Allows 3 password operations per hour per IP address
 */
export const passwordRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password operations per windowMs
  message: {
    error: 'Too many password operations',
    message: 'You have exceeded the maximum number of password operations. Please try again in 1 hour.',
    retryAfter: 3600 // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.log(`🚫 Password operation rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many password operations',
      message: 'You have exceeded the maximum number of password operations. Please try again in 1 hour.',
      retryAfter: 3600
    });
  },
  skip: (req: Request) => {
    // Skip rate limiting for localhost in development
    if (process.env.NODE_ENV === 'development' && 
        (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip?.includes('localhost'))) {
      return true;
    }
    return false;
  }
});

/**
 * General API rate limiter
 * Allows 100 requests per 15 minutes per IP address
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'You have exceeded the maximum number of requests. Please try again in 15 minutes.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.log(`🚫 General rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests',
      message: 'You have exceeded the maximum number of requests. Please try again in 15 minutes.',
      retryAfter: 900
    });
  },
  skip: (req: Request) => {
    // Skip rate limiting for localhost in development
    if (process.env.NODE_ENV === 'development' && 
        (req.ip === '127.0.0.1' || req.ip === '::1' || req.ip?.includes('localhost'))) {
      return true;
    }
    return false;
  }
});

/**
 * Create a custom rate limiter for specific endpoints
 * @param windowMs - Time window in milliseconds
 * @param max - Maximum number of requests allowed
 * @param message - Custom error message
 */
export function createCustomRateLimiter(
  windowMs: number,
  max: number,
  message: string
) {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Rate limit exceeded',
      message,
      retryAfter: Math.floor(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      console.log(`🚫 Custom rate limit exceeded for IP: ${req.ip} - ${message}`);
      res.status(429).json({
        error: 'Rate limit exceeded',
        message,
        retryAfter: Math.floor(windowMs / 1000)
      });
    }
  });
}