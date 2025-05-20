import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext } from "./index.mjs";
import { appRouter } from "./routers/_app.mjs";
import express from "express";
import cors from "cors";
import { expressHandler } from "trpc-playground/handlers/express";

const playgroundEndpoint = "/api/trpc-playground";
const trpcApiEndpoint = "/api/trpc";

export async function setupTrpcServer(app: express.Express) {
  app.use(cors());

  app.use(
    trpcApiEndpoint,
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (process.env.NODE_ENV === "development") {
    app.use(
      playgroundEndpoint,
      await expressHandler({
        trpcApiEndpoint,
        playgroundEndpoint,
        router: appRouter,
      })
    );
  }

  console.log("🚀 tRPC server and playground initialized");
}
