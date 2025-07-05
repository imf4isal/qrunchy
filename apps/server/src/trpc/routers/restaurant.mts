import { publicProcedure, router } from "../index.mts";
import { restaurantProcedures } from "../procedures/restaurant.mts";
import { chainProcedures } from "../procedures/chain.mts";

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
  
  // Theme management
  updateTheme: restaurantProcedures.updateTheme,

  // Chain management
  createChain: chainProcedures.create,
  getChainsByUser: chainProcedures.getByUser,
  getChainById: chainProcedures.getById,
  updateChain: chainProcedures.update,
  deleteChain: chainProcedures.delete,
  getChainsWithRestaurants: chainProcedures.getWithRestaurants,
});