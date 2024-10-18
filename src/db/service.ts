import type { TSelect } from "@/schemas/sale";
import {
  services,
  type InsertService,
  type SelectService,
} from "@/schemas/service";
import { and, desc, eq, like, type DBQueryConfig } from "drizzle-orm";
import { db } from ".";
import type { LoggedUser } from "@/schemas/user";

export const getServices = async <T extends boolean>(
  searchText: string | null | undefined,
  asItems: T,
  user: LoggedUser
): Promise<T extends true ? TSelect<"service"> : SelectService[]> => {
  const searchConfig: DBQueryConfig = {
    where: eq(services.company_id, user.company_id),
    limit: 5,
    orderBy: [desc(services.id)],
  };
  if (!!searchText) {
    searchConfig.where = and(
      eq(services.company_id, user.company_id),
      like(services.name, `%${searchText}%`)
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
