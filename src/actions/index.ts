import sale from "./sale";
import service from "./service";
import brand from "./brand";
import report from "./report";
import ui from "./ui";
import blobs from "./blobs";
import user from "./user";
import cashflow from "./cashflow";
import vehicle from "./vehicle";

export const server = {
  ...service,
  ...brand,
  ...report,
  ...sale,
  ...blobs,
  ...user,
  ...cashflow,
  ...vehicle,
  ...ui,
};
