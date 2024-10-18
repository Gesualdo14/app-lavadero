import type { TSelect } from "@/schemas/sale";
import {
  services,
  type InsertService,
  type SelectService,
} from "@/schemas/service";
import { desc, like, type DBQueryConfig } from "drizzle-orm";
import { db } from ".";

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

export async function createService(data: InsertService) {
  return await db.insert(services).values(data);
}
