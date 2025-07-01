import { publicProcedure, router } from "../index.mts";
import { restaurantProcedures } from "../procedures/restaurant.mts";

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