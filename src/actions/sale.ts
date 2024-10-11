import { createSale, getSales } from "@/db/config";
import { saleFormSchema } from "@/schemas/sale";
import { defineAction } from "astro:actions";

const sale = {
  get: defineAction({
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
};

export default sale;
