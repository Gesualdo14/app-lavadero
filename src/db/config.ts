import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import {
  salesTable,
  usersTable,
  vehiclesTable,
  type InsertUser,
  type SelectSale,
  type SelectUser,
  type SelectVehicle,
} from "./schema";
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

export const getVehicles = async (): Promise<SelectVehicle[]> => {
  return await db
    .select()
    .from(vehiclesTable)
    .orderBy(desc(vehiclesTable.id))
    .limit(5);
};
export const getSales = async (): Promise<SelectSale[]> => {
  return await db
    .select()
    .from(salesTable)
    .orderBy(desc(salesTable.id))
    .limit(5);
};
