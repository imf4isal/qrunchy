import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { rateLimitService, createRateLimitKey, RateLimitError } from "../utils/rateLimitService.mts";
import { verifyJWTToken, extractTokenFromHeader, type JWTUserPayload } from "../utils/jwt.mts";

export const createContext = ({ req, res }: CreateExpressContextOptions) => ({
  req,
  res,
  user: null as JWTUserPayload | null, // Will be populated by auth middleware
});

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;

/**
 * Rate limiting middleware for tRPC procedures
 * @param type - Type of rate limit to apply ('otp', 'login', 'password')
 */
export const withRateLimit = (type: 'otp' | 'login' | 'password') =>
  middleware(async ({ ctx, next }) => {
    const ip = ctx.req.ip || ctx.req.connection.remoteAddress || 'unknown';
    const key = createRateLimitKey(ip, type);
    
    const result = rateLimitService.checkRateLimit(key, type);
    
    if (!result.allowed) {
      const timeUntilReset = rateLimitService.getTimeUntilReset(key, type);
      
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: result.error || 'Rate limit exceeded',
        cause: new RateLimitError(result.error || 'Rate limit exceeded', timeUntilReset)
      });
    }
    
    return next();
  });

/**
 * JWT authentication middleware for tRPC procedures
 * Requires a valid JWT token in Authorization header
 * Adds user information to context
 */
export const withAuth = middleware(async ({ ctx, next }) => {
  const authHeader = ctx.req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication token required. Please log in.',
    });
  }

  try {
    const user = verifyJWTToken(token);
    
    // Add user to context for use in procedures
    return next({
      ctx: {
        ...ctx,
        user,
      },
    });
  } catch (error) {
    // JWT verification will throw TRPCError, so just re-throw
    throw error;
  }
});

/**
 * Optional JWT authentication middleware
 * Does not require authentication but adds user to context if token is present
 */
export const withOptionalAuth = middleware(async ({ ctx, next }) => {
  const authHeader = ctx.req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    // No token provided, proceed without user context
    return next({
      ctx: {
        ...ctx,
        user: null,
      },
    });
  }

  try {
    const user = verifyJWTToken(token);
    
    // Add user to context
    return next({
      ctx: {
        ...ctx,
        user,
      },
    });
  } catch (error) {
    // Invalid token, proceed without user context (don't throw error)
    console.log('Optional auth failed, proceeding without user context:', error instanceof Error ? error.message : 'Unknown error');
    return next({
      ctx: {
        ...ctx,
        user: null,
      },
    });
  }
});

// Authenticated procedure - requires JWT token
export const authenticatedProcedure = t.procedure.use(withAuth);

// Optionally authenticated procedure - works with or without JWT token
export const optionallyAuthenticatedProcedure = t.procedure.use(withOptionalAuth);
