import { publicProcedure, router } from "../index.mts";
import { userProcedures } from "../procedures/user.mts";

export const userRouter = router({
  // Simple test endpoint
  test: publicProcedure.query(() => {
    return { message: "User router is working!" };
  }),

  // User CRUD operations
  create: userProcedures.create,
  getByMobile: userProcedures.getByMobile,
  getById: userProcedures.getById,
});