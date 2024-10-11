import { createClient } from "@libsql/client";
import schema from "@/schemas/index";
import { desc, eq, like, or, type DBQueryConfig } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { users, type InsertUser, type SelectUser } from "@/schemas/user";
import { vehicles, type SelectVehicle } from "@/schemas/vehicle";
import { sales, type Sale, type TSale, type TSelect } from "@/schemas/sale";
import {
  services,
  type InsertService,
  type SelectService,
} from "@/schemas/service";
import {
  saleItems,
  type InsertSaleItem,
  type SaleItem,
  type SelectSaleItem,
} from "@/schemas/sale-item";
import type { z } from "zod";

export const turso = createClient({
  url: import.meta.env.TURSO_DATABASE_URL ?? "",
  authToken: import.meta.env.TURSO_AUTH_TOKEN ?? "",
});

export const db = drizzle(turso, { schema });

export async function createUser(data: InsertUser) {
  return await db.insert(users).values(data);
}

export const getUsers = async <T extends boolean>(
  searchText: string | null | undefined,
  asItems: T,
  filterId?: number
): Promise<T extends true ? TSelect : SelectUser[]> => {
  const searchConfig: DBQueryConfig = {
    limit: 5,
  };
  if (!!searchText) {
    searchConfig.where = or(
      like(users.firstname, `%${searchText}%`),
      like(users.lastname, `%${searchText}%`)
    );
    searchConfig.limit = undefined;
  }
  const result = await db.query.users.findMany(searchConfig);
  if (asItems) {
    return result.map((u) => ({
      id: u.id,
      name: `${u.firstname} ${u.lastname}`,
    })) as any;
  } else {
    return result as any;
  }
};

export const getVehicles = async <T extends boolean>(
  searchText: string | null | undefined,
  asItems: T,
  filterId?: number
): Promise<T extends true ? TSelect : SelectVehicle[]> => {
  const searchConfig: DBQueryConfig = {
    where: eq(vehicles.user_id, filterId as number),
    limit: 5,
    orderBy: [desc(vehicles.id)],
  };
  if (!!searchText) {
    searchConfig.where = or(
      like(vehicles.brand, `%${searchText}%`),
      like(vehicles.model, `%${searchText}%`),
      like(vehicles.patent, `%${searchText}%`)
    );
  }
  console.log({ filterId, searchText });
  const result = await db.query.vehicles.findMany(searchConfig);
  if (asItems) {
    return result.map((v) => ({
      id: v.id,
      name: `${v.brand} ${v.model}`,
    })) as any;
  } else {
    return result as any;
  }
};

export const getSales = async (): Promise<TSale[]> => {
  return await db.query.sales.findMany({
    limit: 5,
    with: { user: true, vehicle: true },
    orderBy: [desc(sales.id)],
  });
};

export async function createSale(data: Sale) {
  const { services, user, vehicle, total_amount } = data;
  return await db.transaction(async (tx) => {
    const { lastInsertRowid } = await tx
      .insert(sales)
      .values({ vehicle_id: vehicle[0].id, user_id: user[0].id, total_amount });

    await tx.insert(saleItems).values(
      services.map((s) => ({
        service_id: s.id,
        sale_id: Number(lastInsertRowid),
        price: s.value as number,
      }))
    );
  });
}

export const getSaleItems = async (): Promise<SelectSaleItem[]> => {
  return await db.query.saleItems.findMany({
    limit: 5,
    orderBy: [desc(saleItems.id)],
  });
};

export async function createSaleItems(data: InsertSaleItem[]) {
  return await db.insert(saleItems).values(data);
}

export const getServices = async <T extends boolean>(
  searchText: string | null | undefined,
  asItems: T,
  filterId?: number
): Promise<T extends true ? TSelect : SelectService[]> => {
  const searchConfig: DBQueryConfig = {
    limit: 5,
    orderBy: [desc(services.id)],
  };
  if (!!searchText) {
    searchConfig.where = like(services.name, `%${searchText}%`);
  }

  const results = await db.query.services.findMany(searchConfig);

  if (asItems) {
    return results.map((s) => ({
      id: s.id,
      name: s.name,
      value: s.price,
    })) as any;
  } else {
    return results as any;
  }
};

export async function createService(data: InsertService) {
  return await db.insert(services).values(data);
}
