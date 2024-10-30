import { createVehicle, deleteVehicle, getVehicles } from "@/db/vehicle";
import { defineAction } from "astro:actions";
import { z } from "zod";

const vehicle = {
  getVehicles: defineAction({
    input: z.object({
      searchText: z.string().nullish(),
      asItems: z.boolean(),
    }),
    handler: async ({ searchText }) => {
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
  createVehicle: defineAction({
    input: z.object({
      brand: z.string(),
      model: z.string(),
      patent: z.string(),
      user_id: z.number(),
    }),
    handler: async (vehicle) => {
      try {
        const { lastInsertRowid } = await createVehicle(vehicle);

        return {
          ok: true,
          data: lastInsertRowid,
          message: "",
        };
      } catch (error) {
        const my_error = error as Error;
        return { ok: false, data: [], message: my_error.message || "" };
      }
    },
  }),
  deleteVehicle: defineAction({
    input: z.number(),

    handler: async (vehicle_id, { locals }) => {
      try {
        await deleteVehicle(vehicle_id, locals.user?.id as number);

        return {
          ok: true,
          message: "Vehículo eliminado con éxito",
        };
      } catch (error) {
        const my_error = error as Error;
        return { ok: false, data: [], message: my_error.message || "" };
      }
    },
  }),
};

export default vehicle;
