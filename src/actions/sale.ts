import { createSale, getSales, updateSale } from "@/db/config";
import { saleFormSchema } from "@/schemas/sale";
import { defineAction } from "astro:actions";
import { z } from "zod";

const sale = {
  get: defineAction({
    input: z.object({ searchText: z.string().nullish() }),
    handler: async ({ searchText }) => {
      try {
        const sales = await getSales(searchText);

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
  create: defineAction({
    input: saleFormSchema,
    handler: async (data) => {
      try {
        const result = await createSale(data);
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
  update: defineAction({
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
