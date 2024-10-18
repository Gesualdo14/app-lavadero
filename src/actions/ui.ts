import { getPaymentMethods } from "@/db/cashflow";
import { getServices } from "@/db/service";
import { getUsers } from "@/db/user";
import { getVehicles, getBrands } from "@/db/vehicle";
import { defineAction } from "astro:actions";
import { z } from "zod";

const ui = {
  getItems: defineAction({
    input: z.object({
      searchText: z.string().nullish(),
      entity: z.enum([
        "service",
        "vehicle",
        "client",
        "user",
        "brand",
        "method",
      ]),
      filterId: z.number().optional(),
    }),
    handler: async ({ searchText, entity, filterId }) => {
      try {
        const actionToCall = {
          service: getServices,
          client: getUsers,
          user: getUsers,
          vehicle: getVehicles,
          brand: getBrands,
          method: getPaymentMethods,
        };

        const items = await actionToCall[entity](searchText, true, filterId);

        return {
          ok: true,
          data: items,
          message: "",
        };
      } catch (error) {
        const my_error = error as Error;
        return { ok: false, data: [], message: my_error.message || "" };
      }
    },
  }),
};

export default ui;
