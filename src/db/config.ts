import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { usersTable, type InsertUser, type SelectUser } from "./schema";
import { desc } from "drizzle-orm";

export const turso = createClient({
  url: import.meta.env.TURSO_DATABASE_URL ?? "",
  authToken: import.meta.env.TURSO_AUTH_TOKEN ?? "",
});

export const db = drizzle(turso);

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export const getUsers = async (): Promise<SelectUser[]> => {
  return await db
    .select()
    .from(usersTable)
    .orderBy(desc(usersTable.id))
    .limit(5);
};
