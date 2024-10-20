import sale from "./sale";
import service from "./service";
import brand from "./brand";
import ui from "./ui";
import blobs from "./blobs";
import user from "./user";
import cashflow from "./cashflow";
import vehicle from "./vehicle";

export const server = {
  ...service,
  ...brand,
  ...sale,
  ...blobs,
  ...user,
  ...cashflow,
  ...vehicle,
  ...ui,
};
