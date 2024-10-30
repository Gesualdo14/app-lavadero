import {
  vehicles,
  type InsertVehicle,
  type SelectVehicle,
} from "@/schemas/vehicle";
import { db } from ".";
import {
  and,
  desc,
  eq,
  isNull,
  like,
  or,
  type DBQueryConfig,
} from "drizzle-orm";
import type { TSelect } from "@/schemas/sale";
import { brands, type InsertBrand, type SelectBrand } from "@/schemas/brand";
import type { LoggedUser } from "@/schemas/user";

export const getVehicles = async <T extends boolean>(
  searchText: string | null | undefined,
  asItems: T,
  filterId?: number
): Promise<T extends true ? TSelect<"vehicle"> : SelectVehicle[]> => {
  const searchConfig: DBQueryConfig = {
    where: isNull(vehicles.deleted_by),
    limit: 5,
    orderBy: [desc(vehicles.id)],
  };

  let filterByIdQuery, findQuery;
  if (!!filterId) {
    filterByIdQuery = and(
      isNull(vehicles.deleted_by),
      eq(vehicles.user_id, filterId as number)
    );
  }
  if (!!searchText) {
    findQuery = or(
      like(vehicles.brand, `%${searchText}%`),
      like(vehicles.model, `%${searchText}%`),
      like(vehicles.patent, `%${searchText}%`)
    );
  }

  searchConfig.where = and(filterByIdQuery, findQuery);

  const result = await db.query.vehicles.findMany(searchConfig);

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
    where: and(
      eq(brands.company_id, user.company_id),
      isNull(brands.deleted_by)
    ),
    limit: 5,
    orderBy: [desc(brands.id)],
  };
  if (!!searchText) {
    searchConfig.where = and(
      like(brands.name, `%${searchText}%`),
      eq(brands.company_id, user.company_id),
      isNull(brands.deleted_by)
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

export async function updateBrand(brand_name: string, brand_id: number) {
  return await db
    .update(brands)
    .set({ name: brand_name })
    .where(eq(brands.id, brand_id));
}

export async function deleteBrand(brand_id: number, user_id: number) {
  return await db
    .update(brands)
    .set({ deleted_by: user_id })
    .where(eq(brands.id, brand_id));
}

export async function deleteVehicle(vehicle_id: number, user_id: number) {
  return await db
    .update(vehicles)
    .set({ deleted_by: user_id })
    .where(eq(vehicles.id, vehicle_id));
}
