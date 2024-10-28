import type { TSelect } from "@/schemas/sale";
import {
  services,
  type InsertService,
  type SelectService,
} from "@/schemas/service";
import { and, desc, eq, isNull, like, type DBQueryConfig } from "drizzle-orm";
import { db } from ".";
import type { LoggedUser } from "@/schemas/user";

export const getServices = async <T extends boolean>(
  searchText: string | null | undefined,
  asItems: T,
  user: LoggedUser
): Promise<T extends true ? TSelect<"service"> : SelectService[]> => {
  const searchConfig: DBQueryConfig = {
    where: and(
      eq(services.company_id, user.company_id),
      isNull(services.deleted_by)
    ),
    limit: 5,
    orderBy: [desc(services.id)],
  };
  if (!!searchText) {
    searchConfig.where = and(
      eq(services.company_id, user.company_id),
      like(services.name, `%${searchText}%`),
      isNull(services.deleted_by)
    );
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

export async function createService(data: InsertService) {
  return await db.insert(services).values(data);
}
export async function updateService(data: Partial<InsertService>) {
  return await db
    .update(services)
    .set(data)
    .where(eq(services.id, data.id as number));
}
export async function deleteService(service_id: number, user_id: number) {
  return await db
    .update(services)
    .set({ deleted_by: user_id })
    .where(eq(services.id, service_id as number));
}
