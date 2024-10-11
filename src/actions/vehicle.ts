import { getVehicles } from "@/db/config";
import { defineAction } from "astro:actions";
import { z } from "zod";

const vehicle = {
  get: defineAction({
    input: z.object({
      searchText: z.string().nullish(),
      asItems: z.boolean(),
    }),
    handler: async ({ searchText, asItems }) => {
      try {
        const vehicles = await getVehicles(searchText, false);

        console.log(vehicles);

        return {
          ok: true,
          data: vehicles,
          message: "",
        };
      } catch (error) {
        const my_error = error as Error;
        return { ok: false, data: [], message: my_error.message || "" };
      }
    },
  }),
};

export default vehicle;
