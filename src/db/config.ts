import { createClient } from "@libsql/client";
import schema from "@/schemas/index";
import { and, desc, eq, like, or, type DBQueryConfig } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { users, type InsertUser, type SelectUser } from "@/schemas/user";
import {
  vehicles,
  type InsertVehicle,
  type SelectVehicle,
} from "@/schemas/vehicle";
import { sales, type Sale, type TSale, type TSelect } from "@/schemas/sale";
import {
  services,
  type InsertService,
  type SelectService,
} from "@/schemas/service";
import {
  saleItems,
  type InsertSaleItem,
  type SelectSaleItem,
} from "@/schemas/sale-item";
import { brands, type InsertBrand, type SelectBrand } from "@/schemas/brand";

export const turso = createClient({
  url: import.meta.env.TURSO_DATABASE_URL ?? "",
  authToken: import.meta.env.TURSO_AUTH_TOKEN ?? "",
});

export const db = drizzle(turso, { schema });

export async function createUser(
  user: InsertUser,
  vehicle: Omit<InsertVehicle, "user_id">
) {
  return await db.transaction(async (tx) => {
    const { lastInsertRowid } = await tx.insert(users).values(user);
    if (!!vehicle) {
      await tx
        .insert(vehicles)
        .values({ ...vehicle, user_id: Number(lastInsertRowid) });
    }
  });
}
export async function updateUser(user: InsertUser, userId: number) {
  return await db.update(users).set(user).where(eq(users.id, userId));
}

export const getUsers = async <T extends boolean>(
  searchText: string | null | undefined,
  asItems: T,
  filterId?: number
): Promise<T extends true ? TSelect<"user"> : SelectUser[]> => {
  const searchConfig: DBQueryConfig = {
    limit: 5,
    orderBy: desc(users.id),
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
      details: u,
    })) as any;
  } else {
    return result as any;
  }
};

export const getVehicles = async <T extends boolean>(
  searchText: string | null | undefined,
  asItems: T,
  filterId?: number
): Promise<T extends true ? TSelect<"vehicle"> : SelectVehicle[]> => {
  const searchConfig: DBQueryConfig = {
    limit: 5,
    orderBy: [desc(vehicles.id)],
  };

  let filterByIdQuery, findQuery;
  if (!!filterId) {
    filterByIdQuery = eq(vehicles.user_id, filterId as number);
  }
  if (!!searchText) {
    findQuery = or(
      like(vehicles.brand, `%${searchText}%`),
      like(vehicles.model, `%${searchText}%`),
      like(vehicles.patent, `%${searchText}%`)
    );
  }

  searchConfig.where = and(filterByIdQuery, findQuery);
  console.log({ filterId, searchText });
  const result = await db.query.vehicles.findMany(searchConfig);
  console.log({ result, searchConfig });
  if (asItems) {
    return result.map((v) => ({
      id: v.id,
      name: `${v.brand} ${v.model}`,
      details: v,
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
export async function createVehicle(data: InsertVehicle) {
  return await db.insert(vehicles).values(data);
}

export const getServices = async <T extends boolean>(
  searchText: string | null | undefined,
  asItems: T,
  filterId?: number
): Promise<T extends true ? TSelect<"service"> : SelectService[]> => {
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
      details: s,
    })) as any;
  } else {
    return results as any;
  }
};

export const getBrands = async <T extends boolean>(
  searchText: string | null | undefined,
  asItems: T
): Promise<T extends true ? TSelect<"brand"> : SelectBrand[]> => {
  const searchConfig: DBQueryConfig = {
    limit: 5,
    orderBy: [desc(brands.id)],
  };
  if (!!searchText) {
    searchConfig.where = like(brands.name, `%${searchText}%`);
  }

  const results = await db.query.brands.findMany(searchConfig);

  if (asItems) {
    return results.map((b) => ({
      id: b.id,
      name: b.name,
    })) as any;
  } else {
    return results as any;
  }
};

export async function createBrand(data: InsertBrand) {
  return await db.insert(brands).values(data);
}
export async function createService(data: InsertService) {
  return await db.insert(services).values(data);
}
