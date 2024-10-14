import { createBrand, getBrands } from "@/db/config";
import { brandFormSchema } from "@/schemas/brand";
import { defineAction } from "astro:actions";
import { z } from "zod";

const brand = {
  get: defineAction({
    input: z.object({ searchText: z.string().nullish() }),
    handler: async ({ searchText }) => {
      try {
        const brands = await getBrands(searchText, false);

        return {
          ok: true,
          data: brands,
          message: "",
        };
      } catch (error) {
        const my_error = error as Error;
        return { ok: false, data: [], message: my_error.message || "" };
      }
    },
  }),
  create: defineAction({
    input: brandFormSchema,
    handler: async (data) => {
      try {
        const result = await createBrand(data);
        console.log(result);
        return {
          ok: true,
          data: { id: 1 },
          message: "Marca creada con éxito",
        };
      } catch (error) {
        console.log({ error });
        if (error instanceof Error)
          return { ok: false, message: error.message };
      }
    },
  }),
};

export default brand;
