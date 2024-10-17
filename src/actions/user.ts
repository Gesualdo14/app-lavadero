import { createUser, getUserByEmail, getUsers, updateUser } from "@/db/config";
import { userFormSchema, type User } from "@/schemas/user";
import { defineAction } from "astro:actions";
import { z } from "zod";
import jwt from "jsonwebtoken";

const user = {
  login: defineAction({
    input: z.object({ email: z.string().email(), password: z.string() }),
    handler: async ({ email, password }, context) => {
      const { cookies } = context;
      console.log({ email });
      const user = await getUserByEmail(email);
      if (!user) {
        return { ok: false, message: "No existe un usuario con ese correo" };
      }

      if (user.password !== password)
        return { ok: false, message: "Contraseña incorrecta" };

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
        },
        process?.env?.JWT_SECRET_KEY as string
      );

      cookies.set("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60,
        path: "/",
        sameSite: "strict",
      });

      return {
        ok: true,
        message: "Login exitoso",
      };
    },
  }),
  logout: defineAction({
    handler: async (_, context) => {
      const { cookies } = context;

      cookies.set("jwt", "", {
        httpOnly: true,
        expires: new Date(),
        maxAge: 0,
        path: "/",
        sameSite: "strict",
      });

      return {
        ok: true,
        message: "Logout exitoso",
      };
    },
  }),
  getUsers: defineAction({
    input: z.object({
      searchText: z.string().nullish(),
      justClients: z.boolean().default(false),
    }),
    handler: async ({ searchText, justClients }) => {
      try {
        const users = await getUsers(searchText, false, justClients ? 1 : 0);

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
  createUser: defineAction({
    input: userFormSchema,
    handler: async (data) => {
      try {
        console.log({ data });
        const result = await createUser(
          {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            company_id: 1,
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
  updateUser: defineAction({
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
