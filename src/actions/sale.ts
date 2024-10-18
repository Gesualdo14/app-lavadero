import { createSale, getSales, updateSale } from "@/db/sale";
import { saleFormSchema } from "@/schemas/sale";
import type { LoggedUser } from "@/schemas/user";
import { defineAction } from "astro:actions";
import { z } from "zod";

const sale = {
  getSales: defineAction({
    input: z.object({ searchText: z.string().nullish() }),
    handler: async ({ searchText }, { cookies }) => {
      const token = await cookies.get("jwt")?.value;
      console.log({ token });
      try {
        const sales = await getSales(searchText);

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
    handler: async (data, { locals }) => {
      try {
        const result = await createSale({
          ...data,
          company_id: locals.user?.company_id as number,
          created_by: locals.user?.id as number,
        });
        console.log(result);

        return {
          ok: true,
          data: [],
          message: "Venta creada con éxito",
        };
      } catch (error) {
        console.log({ error });
        if (error instanceof Error)
          return { ok: false, data: [], message: error.message };
      }
    },
  }),
  updateSale: defineAction({
    input: saleFormSchema,
    handler: async (data) => {
      try {
        console.log({ data });
        const result = await updateSale(data);
        console.log({ result });

        return {
          ok: true,
          data: [],
          message: "Venta actualizada con éxito",
        };
      } catch (error) {
        console.log({ error });
        if (error instanceof Error)
          return { ok: false, message: error.message };
      }
    },
  }),
};

export default sale;
