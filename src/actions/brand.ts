import { createBrand, deleteBrand, getBrands, updateBrand } from "@/db/vehicle";
import { brandFormSchema } from "@/schemas/brand";
import type { LoggedUser } from "@/schemas/user";
import { defineAction } from "astro:actions";
import { z } from "zod";

const brand = {
  getBrands: defineAction({
    input: z.object({ searchText: z.string().nullish() }),
    handler: async ({ searchText }, { locals }) => {
      try {
        const brands = await getBrands(
          searchText,
          false,
          locals.user as LoggedUser
        );

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
  createBrand: defineAction({
    input: brandFormSchema,
    handler: async (data, { locals: { user } }) => {
      try {
        console.log({ data });
        const result = await createBrand({
          ...data,
          company_id: user?.company_id as number,
        });
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
  updateBrand: defineAction({
    input: z.object({ name: z.string(), id: z.number() }),
    handler: async (brand) => {
      try {
        const result = await updateBrand(brand.name, brand.id as number);
        console.log(result);
        return {
          ok: true,
          data: { id: 1 },
          message: "Marca actualizada con éxito",
        };
      } catch (error) {
        console.log({ error });
        if (error instanceof Error)
          return { ok: false, message: error.message };
      }
    },
  }),
  deleteBrand: defineAction({
    input: z.number(),
    handler: async (brand_id, { locals: { user } }) => {
      try {
        const result = await deleteBrand(brand_id, user?.id as number);
        console.log(result);
        return {
          ok: true,
          data: { id: 1 },
          message: "Marca eliminada con éxito",
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
