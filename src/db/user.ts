import {
  users,
  type InsertUser,
  type LoggedUser,
  type SelectUser,
} from "@/schemas/user";
import { vehicles, type InsertVehicle } from "@/schemas/vehicle";
import { db } from ".";
import type { TSelect } from "@/schemas/sale";
import { and, desc, eq, like, or, type DBQueryConfig } from "drizzle-orm";

export async function createUser(
  user: InsertUser,
  vehicle: Omit<InsertVehicle, "user_id"> | null
) {
  return await db.transaction(async (tx) => {
    const { lastInsertRowid } = await tx.insert(users).values(user);
    if (!!vehicle) {
      await tx
        .insert(vehicles)
        .values({ ...vehicle, user_id: Number(lastInsertRowid) });
    }
    return { user_id: Number(lastInsertRowid) };
  });
}

export async function updateUser(user: Partial<InsertUser>, userId: number) {
  return await db.update(users).set(user).where(eq(users.id, userId));
}

export async function deleteUser(userId: number) {
  return await db
    .update(users)
    .set({ deleted_by: userId })
    .where(eq(users.id, userId));
}

export const getUsers = async <T extends boolean>(
  searchText: string | null | undefined,
  asItems: T,
  isClient: number | undefined,
  user: LoggedUser
): Promise<T extends true ? TSelect<"users"> : SelectUser[]> => {
  const searchConfig: DBQueryConfig = {
    where: and(
      eq(users.is_client, isClient as number),
      eq(users.company_id, user.company_id)
    ),
    limit: 8,
    orderBy: desc(users.id),
  };

  if (!!searchText) {
    searchConfig.where = and(
      or(
        like(users.firstname, `%${searchText}%`),
        like(users.lastname, `%${searchText}%`)
      ),
      eq(users.is_client, isClient as number),
      eq(users.company_id, user.company_id)
    );
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

export const getUserByEmail = async (email: string) => {
  return await db.query.users.findFirst({ where: eq(users.email, email) });
};
