import { publicProcedure, router } from "../index.mts";
import { categoriesProcedures } from "../procedures/categories.mts";
import { itemsProcedures } from "../procedures/items.mts";
import { menuProcedures } from "../procedures/menu.mts";
import { qrProcedures } from "../procedures/qr.mts";

export const digitalMenuRouter = router({
  // Simple test endpoint
  test: publicProcedure.query(() => {
    return { message: "Digital menu router is working!" };
  }),

  // Categories CRUD operations
  categories: categoriesProcedures,

  // Menu Items CRUD operations  
  items: itemsProcedures,

  // Complete Menu operations
  menu: menuProcedures,

  // QR Code management
  qr: qrProcedures,
});