import { publicProcedure, router } from "../index.mjs";
import { categoriesProcedures } from "../procedures/categories.mjs";
import { itemsProcedures } from "../procedures/items.mjs";
import { menuProcedures } from "../procedures/menu.mjs";
import { qrProcedures } from "../procedures/qr.mjs";

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