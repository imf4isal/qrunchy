import { publicProcedure, router } from "../index.mjs";
import { restaurantProcedures } from "../procedures/restaurant.mjs";

export const restaurantRouter = router({
  // Simple test endpoint
  test: publicProcedure.query(() => {
    return { message: "Restaurant router is working!" };
  }),

  // Restaurant CRUD operations
  create: restaurantProcedures.create,
  getByUser: restaurantProcedures.getByUser,
  getById: restaurantProcedures.getById,
  update: restaurantProcedures.update,
});