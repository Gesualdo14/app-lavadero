import sale from "./sale";
import service from "./service";
import ui from "./ui";
import user from "./user";
import vehicle from "./vehicle";

export const server = {
  createServices: service.create,
  getServices: service.get,
  createSale: sale.create,
  getSales: sale.get,
  createUser: user.create,
  getUsers: user.get,
  getVehicles: vehicle.get,
  getSelectItems: ui.getItems,
};
