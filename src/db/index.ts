import { createClient } from "@libsql/client";
import schema from "@/schemas/index";
import { drizzle } from "drizzle-orm/libsql";

export const turso = createClient({
  url: import.meta.env.TURSO_DATABASE_URL ?? "",
  authToken: import.meta.env.TURSO_AUTH_TOKEN ?? "",
});

export const db = drizzle(turso, { schema });
