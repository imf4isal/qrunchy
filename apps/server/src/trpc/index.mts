import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { rateLimitService, createRateLimitKey, RateLimitError } from "../utils/rateLimitService.mts";

export const createContext = ({ req, res }: CreateExpressContextOptions) => ({
  req,
  res,
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
