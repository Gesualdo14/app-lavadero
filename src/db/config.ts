import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import { sales, users, vehicles, services } from "./schema";
import { desc } from "drizzle-orm";

export const turso = createClient({
  url: import.meta.env.TURSO_DATABASE_URL ?? "",
  authToken: import.meta.env.TURSO_AUTH_TOKEN ?? "",
});

export const db = drizzle(turso, { schema });

export async function createUser(data: schema.InsertUser) {
  return await db.insert(users).values(data);
}

export const getUsers = async (): Promise<schema.SelectUser[]> => {
  return await db.query.users.findMany({
    limit: 5,
    orderBy: [desc(users.id)],
  });
};

export const getVehicles = async (): Promise<schema.SelectVehicle[]> => {
  return await db.query.vehicles.findMany({
    limit: 5,
    orderBy: [desc(vehicles.id)],
  });
};

export const getSales = async (): Promise<schema.TSale[]> => {
  return await db.query.sales.findMany({
    limit: 5,
    with: { user: true, vehicle: true },
    orderBy: [desc(sales.id)],
  });
};

export async function createSale(data: schema.InsertSale) {
  return await db.insert(sales).values(data);
}

export const getServices = async (): Promise<schema.SelectService[]> => {
  return await db.query.services.findMany({
    limit: 5,
    orderBy: [desc(services.id)],
  });
};

export async function createService(data: schema.InsertService) {
  return await db.insert(services).values(data);
}
