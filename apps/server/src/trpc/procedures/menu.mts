// Note: This file combines menu-related procedures
import { menuCoreProcedures } from "./menu-core.mts";
import { menuBulkImportProcedures } from "./menu-bulk-import.mts";

// Combine all menu-related procedures
export const menuProcedures = {
  // Core menu operations (getComplete, getByQrCode, export)
  ...menuCoreProcedures,
  
  // Bulk import operations
  ...menuBulkImportProcedures,
};