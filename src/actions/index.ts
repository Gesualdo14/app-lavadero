import {
  createSale,
  createService,
  createUser,
  getSales,
  getServices,
  getUsers,
  getVehicles,
} from "@/db/config";
import { saleFormSchema } from "@/schemas/sale";
import { serviceFormSchema } from "@/schemas/service";
import { userFormSchema } from "@/schemas/user";
import { defineAction } from "astro:actions";

export const server = {
  createUser: defineAction({
    input: userFormSchema,
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
  createSale: defineAction({
    input: saleFormSchema,
    handler: async (data) => {
      try {
        const result = await createSale(data);
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
  getServices: defineAction({
    handler: async () => {
      try {
        const services = await getServices();

        console.log(services);

        return {
          ok: true,
          data: services,
          message: "",
        };
      } catch (error) {
        const my_error = error as Error;
        return { ok: false, data: [], message: my_error.message || "" };
      }
    },
  }),
  createService: defineAction({
    input: serviceFormSchema,
    handler: async (data) => {
      try {
        const result = await createService(data);
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
};
