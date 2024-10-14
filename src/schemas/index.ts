import * as saleSchema from "./sale";
import * as saleItemSchema from "./sale-item";
import * as userSchema from "./user";
import * as vehicleSchema from "./vehicle";
import * as brandSchema from "./brand";
import * as serviceSchema from "./service";

export default {
  ...saleItemSchema,
  ...saleSchema,
  ...userSchema,
  ...vehicleSchema,
  ...serviceSchema,
  ...brandSchema,
};
