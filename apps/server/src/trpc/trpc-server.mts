import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers/index.mts";
import { createContext } from "./index.mts";
import express from "express";

export const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
});

export const trpcRouter = express.Router();
trpcRouter.use("/trpc", trpcMiddleware);
