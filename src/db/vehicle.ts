import {
  vehicles,
  type InsertVehicle,
  type SelectVehicle,
} from "@/schemas/vehicle";
import { db } from ".";
import { and, desc, eq, like, or, type DBQueryConfig } from "drizzle-orm";
import type { TSelect } from "@/schemas/sale";
import { brands, type InsertBrand, type SelectBrand } from "@/schemas/brand";
import type { LoggedUser } from "@/schemas/user";

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

export async function createVehicle(data: InsertVehicle) {
  return await db.insert(vehicles).values(data);
}

export const getBrands = async <T extends boolean>(
  searchText: string | null | undefined,
  asItems: T,
  user: LoggedUser
): Promise<T extends true ? TSelect<"brand"> : SelectBrand[]> => {
  const searchConfig: DBQueryConfig = {
    where: eq(brands.company_id, user.company_id),
    limit: 5,
    orderBy: [desc(brands.id)],
  };
  if (!!searchText) {
    searchConfig.where = and(
      like(brands.name, `%${searchText}%`),
      eq(brands.company_id, user.company_id)
    );
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
