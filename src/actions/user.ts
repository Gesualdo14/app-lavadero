import {
  createUser,
  deleteUser,
  getUserByEmail,
  getUsers,
  updateUser,
} from "@/db/user";
import { userFormSchema, type LoggedUser } from "@/schemas/user";
import { defineAction } from "astro:actions";
import { z } from "zod";
import jwt from "jsonwebtoken";
import blobs from "./blobs";

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
          company_id: user.company_id,
          role: user.role,
        },
        process?.env?.JWT_SECRET_KEY as string
      );

      cookies.set("jwt", token, {
        httpOnly: true,
        maxAge: 180 * 24 * 60 * 60, // 6 meses
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
    handler: async ({ searchText, justClients }, { locals }) => {
      try {
        const users = await getUsers(
          searchText,
          false,
          justClients ? 1 : 0,
          locals.user as LoggedUser
        );

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
  createClient: defineAction({
    input: userFormSchema.omit({ avatar: true, password: true, role: true }),
    handler: async (data, { locals }) => {
      try {
        const result = await createUser(
          {
            firstname: data.firstname,
            lastname: data.lastname || "",
            email: data.email,
            phone: data.phone,
            company_id: locals.user?.company_id as number,
            is_client: 1,
          },
          {
            brand: Array.isArray(data.brand) ? data.brand[0].name : "",
            model: data.model as string,
            patent: data.patent as string,
          }
        );

        return {
          ok: true,
          data: result,
          message: "Cliente creado con éxito",
        };
      } catch (error: any) {
        return { ok: false, message: error?.message };
      }
    },
  }),
  updateClient: defineAction({
    input: z.object({
      firstname: z.string().optional(),
      lastname: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      id: z.number(),
    }),
    handler: async (data) => {
      try {
        console.log("UPDATE", { data });
        const result = await updateUser(
          {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            phone: data.phone,
          },
          data.id as number
        );
        console.log({ result });

        return {
          ok: true,
          data: { user_id: 0, vehicle_id: 0 },
          message: "Cliente actualizado con éxito",
        };
      } catch (error: any) {
        return { ok: false, message: error?.message };
      }
    },
  }),
  createUser: defineAction({
    accept: "form",
    input: z.object({
      firstname: z.string(),
      lastname: z.string(),
      email: z.string().email(),
      password: z.string().min(4),
      role: z.string(),
      avatar: z.instanceof(File),
    }),
    handler: async (form, { locals }) => {
      try {
        console.log({ form });
        const { user_id } = await createUser(
          {
            firstname: form.firstname,
            lastname: form.lastname,
            email: form.email,
            password: form.password,
            role: form.role,
            company_id: locals.user?.company_id as number,
            is_client: 0,
          },
          null
        );
        const blob = await blobs.upload({
          avatar: form.avatar,
          blob_id: user_id,
        });
        console.log({ blob });

        return {
          ok: true,
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
    accept: "form",
    input: z.object({
      id: z.number(),
      firstname: z.string(),
      lastname: z.string(),
      email: z.string().email(),
      password: z.string().optional(),
      role: z.string(),
      avatar: z.instanceof(File),
    }),
    handler: async (form) => {
      try {
        console.log({ form });
        await updateUser(
          {
            firstname: form.firstname,
            lastname: form.lastname,
            email: form.email,
            password: form.password,
            role: form.role,
          },
          form.id
        );
        const blob = await blobs.upload({
          avatar: form.avatar,
          blob_id: form.id as number,
        });
        console.log({ blob });

        return {
          ok: true,
          message: "Usuario actualizado con éxito",
        };
      } catch (error) {
        console.log({ error });
        if (error instanceof Error)
          return { ok: false, message: error.message };
      }
    },
  }),
  deleteUser: defineAction({
    input: z.number(),
    handler: async (user_to_delete_id, { locals: { user } }) => {
      try {
        await deleteUser(user_to_delete_id, user?.id as number);

        return {
          ok: true,
          message: "Usuario eliminado con éxito",
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
