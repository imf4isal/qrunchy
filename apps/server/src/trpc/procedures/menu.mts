import { router } from "../index.mts";
import { menuCoreProcedures } from "./menu-core.mts";
import { menuBulkImportProcedures } from "./menu-bulk-import.mts";

// Combine all menu-related procedures
export const menuProcedures = router({
  // Core menu operations (getComplete, getByQrCode, export)
  ...menuCoreProcedures._def.procedures,
  
  // Bulk import operations
  ...menuBulkImportProcedures._def.procedures,
});