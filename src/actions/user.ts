import { createUser, getUsers, updateUser } from "@/db/config";
import { userFormSchema } from "@/schemas/user";
import { defineAction } from "astro:actions";
import { z } from "zod";

const user = {
  get: defineAction({
    input: z.object({ searchText: z.string().nullish() }),
    handler: async ({ searchText }) => {
      try {
        const users = await getUsers(searchText, false);

        console.log({ users });

        return {
          ok: true,
          data: users || [],
          message: "",
        };
      } catch (error) {
        const my_error = error as Error;
        return { ok: false, data: [], message: my_error.message || "" };
      }
    },
  }),
  create: defineAction({
    input: userFormSchema,
    handler: async (data) => {
      try {
        console.log({ data });
        const result = await createUser(
          {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
          },
          {
            brand: Array.isArray(data.brand) ? data.brand[0].name : "",
            model: data.model as string,
            patent: data.patent as string,
          }
        );
        console.log({ result });

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
  update: defineAction({
    input: userFormSchema,
    handler: async (data) => {
      try {
        console.log({ data });
        const result = await updateUser(
          {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
          },
          data.id as number
        );
        console.log({ result });

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

export default user;
