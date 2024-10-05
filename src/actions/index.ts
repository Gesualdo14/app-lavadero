import {
  createUser,
  getSales,
  getUsers,
  getVehicles,
  turso,
} from "@/db/config";
import type { SelectUser } from "@/db/schema";
import { formSchema } from "@/schemas/user";
import { defineAction } from "astro:actions";

export const server = {
  createUser: defineAction({
    input: formSchema,
    handler: async (data) => {
      try {
        const result = await createUser(data);
        console.log(result);
        return {
          ok: true,
          data: { id: 1 },
          message: "Usuario creado con éxito",
        };
      } catch (error) {
        console.log({ error });
        if (error instanceof Error)
          return { ok: false, message: error.message };
      }
    },
  }),
  getUsers: defineAction({
    handler: async () => {
      try {
        const users = await getUsers();

        console.log(users);

        return {
          ok: true,
          data: users,
          message: "",
        };
      } catch (error) {
        const my_error = error as Error;
        return { ok: false, data: [], message: my_error.message || "" };
      }
    },
  }),
  getVehicles: defineAction({
    handler: async () => {
      try {
        const vehicles = await getVehicles();

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
  getSales: defineAction({
    handler: async () => {
      try {
        const sales = await getSales();

        console.log(sales);

        return {
          ok: true,
          data: sales,
          message: "",
        };
      } catch (error) {
        const my_error = error as Error;
        return { ok: false, data: [], message: my_error.message || "" };
      }
    },
  }),
};
