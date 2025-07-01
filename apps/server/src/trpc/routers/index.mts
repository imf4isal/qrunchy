import { router } from "../index.mjs";
import { helloRouter } from "./hello.mjs";
import { digitalMenuRouter } from "./digitalMenu.mjs";
import { userRouter } from "./user.mjs";
import { restaurantRouter } from "./restaurant.mjs";

export const appRouter = router({
  hello: helloRouter,
  digitalMenu: digitalMenuRouter,
  user: userRouter,
  restaurant: restaurantRouter,
});

export type AppRouter = typeof appRouter;
