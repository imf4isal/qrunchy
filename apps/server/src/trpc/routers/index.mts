import { router } from "../index.mjs";
import { helloRouter } from "./hello.mjs";
import { digitalMenuRouter } from "./digitalMenu.mjs";

export const appRouter = router({
  hello: helloRouter,
  digitalMenu: digitalMenuRouter,
});

export type AppRouter = typeof appRouter;
