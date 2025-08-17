import dotenv from "dotenv";

// Load environment variables from .env file (for local dev) or use Docker env vars
// First try local .env, then fallback to root .env
dotenv.config({ path: ".env" });
dotenv.config({ path: "../../.env" });

import express from "express";
import routes from "./restroutes/index.mts";
import { trpcRouter } from "./trpc/trpc-server.mts";
import cors from "cors";
import helmet from "helmet";
import { generalRateLimiter } from "./middleware/rateLimiter.mts";

const app = express();

// Security headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Disable for compatibility
  })
);

// Trust proxy for rate limiting (when behind reverse proxy)
app.set('trust proxy', 1);

// General rate limiting for all endpoints (excluding upload routes which have their own rate limiting)
app.use((req, res, next) => {
  // Skip general rate limiting for upload endpoints as they have their own
  if (req.path.includes('/upload/')) {
    return next();
  }
  return generalRateLimiter(req, res, next);
});

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://qrunchy.menu",
      "https://www.qrunchy.menu",
      process.env.FRONTEND_URL,
    ].filter((url): url is string => Boolean(url)),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// JSON parsing with size limit
app.use(express.json({ limit: '10mb' }));

app.use(routes);

app.use(trpcRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} - CI/CD Test`);
  console.log(`tRPC API available at http://localhost:${PORT}/trpc`);
});
