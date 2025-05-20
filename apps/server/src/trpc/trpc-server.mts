import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext } from "./index.mjs";
import { appRouter } from "./routers/_app.mjs";
import express from "express";
import cors from "cors";
import { renderTrpcPanel } from "trpc-panel";

export function setupTrpcServer(app: express.Express) {
  app.use(cors());

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.use("/api/trpc-playground", (_, res) => {
    res.send(
      renderTrpcPanel(appRouter, {
        url: "http://localhost:3000/api/trpc",
        transformer: "superjson",
      })
    );
  });

  console.log("🚀 tRPC server and playground initialized");
}
