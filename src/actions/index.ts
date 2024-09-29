import { turso } from "@/database/config";
import { formSchema } from "@/schemas/User";
import { defineAction } from "astro:actions";

export const server = {
  createUser: defineAction({
    input: formSchema,
    handler: async ({ firstname, lastname, email }) => {
      try {
        console.log({ email });
        const { lastInsertRowid } = await turso.execute({
          sql: "INSERT INTO Users(firstname, lastname, email) VALUES(?, ?, ?)",
          args: [firstname, lastname, email],
        });

        return {
          ok: true,
          data: { id: lastInsertRowid },
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
