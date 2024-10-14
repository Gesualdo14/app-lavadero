import sale from "./sale";
import service from "./service";
import brand from "./brand";
import ui from "./ui";
import user from "./user";
import vehicle from "./vehicle";

export const server = {
  createService: service.create,
  getServices: service.get,
  createBrand: brand.create,
  getBrands: brand.get,
  getSales: sale.get,
  createSale: sale.create,
  updateSale: sale.update,
  createUser: user.create,
  getUsers: user.get,
  updateUser: user.update,
  getVehicles: vehicle.get,
  getSelectItems: ui.getItems,
};
