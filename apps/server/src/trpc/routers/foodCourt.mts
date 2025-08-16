import { router } from "../index.mts";
import { foodCourtProcedures } from "../procedures/foodCourt.mts";

export const foodCourtRouter = router({
  create: foodCourtProcedures.create,
  getByUser: foodCourtProcedures.getByUser,
  getById: foodCourtProcedures.getById,
  getByQrCode: foodCourtProcedures.getByQrCode,
  getQrCode: foodCourtProcedures.getQrCode,
  getRestaurantQrCodes: foodCourtProcedures.getRestaurantQrCodes,
  updateRestaurants: foodCourtProcedures.updateRestaurants,
  searchItems: foodCourtProcedures.searchItems,
  update: foodCourtProcedures.update,
  delete: foodCourtProcedures.delete,
  generateQr: foodCourtProcedures.generateQr,
  getAvailableRestaurants: foodCourtProcedures.getAvailableRestaurants,
});