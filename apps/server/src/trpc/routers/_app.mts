import { router } from "../index.mjs";
import { helloRouter } from "./hello.mjs";

export const appRouter = router({
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
