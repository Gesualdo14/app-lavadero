import * as saleSchema from "./sale";
import * as saleItemSchema from "./sale-item";
import * as userSchema from "./user";
import * as companySchema from "./company";
import * as cashflowSchema from "./cashflow";
import * as vehicleSchema from "./vehicle";
import * as brandSchema from "./brand";
import * as roleSchema from "./role";
import * as serviceSchema from "./service";

export default {
  ...saleItemSchema,
  ...saleSchema,
  ...userSchema,
  ...cashflowSchema,
  ...vehicleSchema,
  ...serviceSchema,
  ...brandSchema,
  ...roleSchema,
  ...companySchema,
};
