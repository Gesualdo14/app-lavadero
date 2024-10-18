import { defineMiddleware } from "astro:middleware";
import jwt from "jsonwebtoken";
import type { LoggedUser } from "./schemas/user";

export const onRequest = defineMiddleware(async (context, next) => {
  // interceptar los datos de una solicitud.
  // opcionalmente, modifica las propiedades en `locals`.
  const { cookies, locals } = context;
  const token = cookies.get("jwt")?.value;

  if (!!token) {
    try {
      const user = (await jwt.verify(
        token,
        import.meta.env.JWT_SECRET_KEY as string
      )) as LoggedUser;
      locals.user = user;
    } catch (error) {
      locals.user = null;
      return next();
    }
  }
  return next();
  // devuelve una respuesta o el resultado de llamar a `next()`.
});
