import { createUser, getUsers } from "@/db/config";
import { userFormSchema } from "@/schemas/user";
import { defineAction } from "astro:actions";
import { z } from "zod";

const user = {
  get: defineAction({
    input: z.object({ searchText: z.string().nullish(), asItems: z.boolean() }),
    handler: async ({ searchText, asItems }) => {
      try {
        const users = await getUsers(searchText, false);

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
  create: defineAction({
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
};

export default user;
