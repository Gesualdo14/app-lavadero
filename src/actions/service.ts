import { createService, getServices } from "@/db/service";
import { serviceFormSchema } from "@/schemas/service";
import type { LoggedUser } from "@/schemas/user";
import { defineAction } from "astro:actions";
import { z } from "zod";

const service = {
  getServices: defineAction({
    input: z.object({ searchText: z.string().nullish() }),
    handler: async ({ searchText }, { locals }) => {
      try {
        const services = await getServices(
          searchText,
          false,
          locals.user as LoggedUser
        );

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
    handler: async (data, { locals }) => {
      try {
        const result = await createService({
          ...data,
          company_id: locals.user?.company_id as number,
        });
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

export default service;
