import { publicProcedure, router } from "../index.mts";
import { authProcedures } from "../procedures/auth.mts";

export const authRouter = router({
  // Simple test endpoint
  test: publicProcedure.query(() => {
    return { message: "Auth router is working!" };
  }),

  // Authentication operations
  login: authProcedures.login,
  me: authProcedures.me,
  logout: authProcedures.logout,
});