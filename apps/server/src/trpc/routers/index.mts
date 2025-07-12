import { router } from "../index.mts";
import { helloRouter } from "./hello.mts";
import { digitalMenuRouter } from "./digitalMenu.mts";
import { userRouter } from "./user.mts";
import { restaurantRouter } from "./restaurant.mts";
import { authRouter } from "./auth.mts";
import { photoMenuRouter } from "./photoMenu.mts";

export const appRouter = router({
  hello: helloRouter,
  digitalMenu: digitalMenuRouter,
  photoMenu: photoMenuRouter,
  user: userRouter,
  restaurant: restaurantRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
