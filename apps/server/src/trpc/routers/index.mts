import { router } from "../index.mts";
import { helloRouter } from "./hello.mts";
import { digitalMenuRouter } from "./digitalMenu.mts";
import { userRouter } from "./user.mts";
import { restaurantRouter } from "./restaurant.mts";

export const appRouter = router({
  hello: helloRouter,
  digitalMenu: digitalMenuRouter,
  user: userRouter,
  restaurant: restaurantRouter,
});

export type AppRouter = typeof appRouter;
