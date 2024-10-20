import { getPaymentMethods } from "@/db/cashflow";
import { getRoles } from "@/db/role";
import { getServices } from "@/db/service";
import { getUsers } from "@/db/user";
import { getVehicles, getBrands } from "@/db/vehicle";
import type { LoggedUser } from "@/schemas/user";
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
        "role",
      ]),
      filterId: z.number().optional(),
    }),
    handler: async ({ searchText, entity, filterId }, { locals }) => {
      try {
        let items;
        const user = locals.user as LoggedUser;
        switch (entity) {
          case "service":
            items = await getServices(searchText, true, user);
            break;
          case "role":
            items = await getRoles();
            break;
          case "user":
            items = await getUsers(searchText, true, 0, user);
            break;
          case "client":
            items = await getUsers(searchText, true, 1, user);
            break;
          case "brand":
            items = await getBrands(searchText, true, user);
            break;
          case "vehicle":
            items = await getVehicles(searchText, true, filterId);
            break;
          case "method":
            items = await getPaymentMethods(searchText, true);
            break;
        }

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
