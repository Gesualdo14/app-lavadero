import { createUser, getUsers, turso } from "@/db/config";
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
};
