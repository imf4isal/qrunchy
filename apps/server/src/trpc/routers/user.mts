import { publicProcedure, router } from "../index.mjs";
import { userProcedures } from "../procedures/user.mjs";

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