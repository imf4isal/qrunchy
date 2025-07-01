import { router } from "../index.mjs";
import { menuCoreProcedures } from "./menu-core.mjs";
import { menuBulkImportProcedures } from "./menu-bulk-import.mjs";

// Combine all menu-related procedures
export const menuProcedures = router({
  // Core menu operations (getComplete, getByQrCode, export)
  ...menuCoreProcedures._def.procedures,
  
  // Bulk import operations
  ...menuBulkImportProcedures._def.procedures,
});