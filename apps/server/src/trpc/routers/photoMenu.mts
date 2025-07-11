import { router } from "../index.mjs";
import { photoMenuProcedures } from "../procedures/photomenu.mjs";

export const photoMenuRouter = router({
  getByRestaurant: photoMenuProcedures.getByRestaurant,
  getByQrCode: photoMenuProcedures.getByQrCode,
  create: photoMenuProcedures.create,
  createMultiple: photoMenuProcedures.createMultiple,
  update: photoMenuProcedures.update,
  updateSortOrder: photoMenuProcedures.updateSortOrder,
  delete: photoMenuProcedures.delete,
  deleteAll: photoMenuProcedures.deleteAll,
  getCount: photoMenuProcedures.getCount,
  generateQr: photoMenuProcedures.generateQr,
});