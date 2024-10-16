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
      const user = (await getUserByEmail(email)) as Partial<User>;
      if (!user) {
        return { ok: false, message: "No existe un usuario con ese correo" };
      }

      if (user.password !== password)
        return { ok: false, message: "Contraseña incorrecta" };

      delete user.password;

      const token = jwt.sign(user, process?.env?.JWT_SECRET_KEY as string);

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
  getUsers: defineAction({
    input: z.object({ searchText: z.string().nullish() }),
    handler: async ({ searchText }) => {
      try {
        const users = await getUsers(searchText, false);

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
