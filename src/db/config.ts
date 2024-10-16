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
import { sales, view_sales, type Sale, type TSelect } from "@/schemas/sale";
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
import { cashflows, type InsertCashflow } from "@/schemas/cashflow";

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
  asItems: T
): Promise<T extends true ? TSelect<"users"> : SelectUser[]> => {
  const searchConfig: DBQueryConfig = {
    limit: 8,
    orderBy: desc(users.id),
  };
  if (!!searchText) {
    searchConfig.where = or(
      like(users.firstname, `%${searchText}%`),
      like(users.lastname, `%${searchText}%`)
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

export const getSales = async (searchText: string | null | undefined) => {
  try {
    let where;
    if (!!searchText) {
      where = or(
        like(view_sales.user.firstname, `%${searchText}%`),
        like(view_sales.user.lastname, `%${searchText}%`),
        like(view_sales.vehicle.brand, `%${searchText}%`),
        like(view_sales.vehicle.model, `%${searchText}%`),
        like(view_sales.vehicle.patent, `%${searchText}%`)
      );
    }

    const result = await db
      .select()
      .from(view_sales)
      .where(where)
      .limit(8)
      .orderBy(desc(view_sales.id));

    return result;
  } catch (error) {
    console.log({ error });
  }
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

export async function updateSale(data: Sale) {
  const { id, services, user, vehicle, total_amount } = data;
  console.log({ id, user, vehicle });
  return await db.transaction(async (tx) => {
    const saleId = id as number;
    await tx
      .update(sales)
      .set({ vehicle_id: vehicle[0].id, user_id: user[0].id, total_amount })
      .where(eq(sales.id, saleId));

    await tx.delete(saleItems).where(eq(saleItems.sale_id, saleId));

    await tx.insert(saleItems).values(
      services.map((s) => ({
        sale_id: saleId,
        service_id: s.id,
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

export async function createCashflow(cashflow: InsertCashflow) {
  return await db.transaction(async (tx) => {
    console.log({ cashflow });
    const created = await tx.insert(cashflows).values(cashflow);
    const currentSale = await tx.query.sales.findFirst({
      where: eq(sales.id, cashflow.sale_id),
    });
    console.log({ currentSale, created });
    const updated = await tx
      .update(sales)
      .set({ gathered: (currentSale?.gathered || 0) + cashflow.amount })
      .where(eq(sales.id, cashflow.sale_id));
    console.log({ updated });
  });
}
export async function updateCashflow(cashflow: InsertCashflow) {
  return await db.transaction(async (tx) => {
    const prevCashflow = await tx.query.cashflows.findFirst({
      where: eq(cashflows.id, cashflow.id as number),
    });
    console.log({ prevCashflow });
    await tx
      .update(cashflows)
      .set({
        method: cashflow.method,
        amount: cashflow.amount,
        updated_at: new Date().toUTCString(),
      })
      .where(eq(cashflows.id, cashflow.id as number));

    const prevSale = await tx.query.sales.findFirst({
      where: eq(sales.id, cashflow.sale_id),
    });

    const gatheredAmount =
      (prevSale?.gathered || 0) - (prevCashflow?.amount || 0) + cashflow.amount;

    console.log({ prevSale, gatheredAmount });
    const result = await tx
      .update(sales)
      .set({
        gathered: gatheredAmount,
      })
      .where(eq(sales.id, cashflow.sale_id));
    console.log({ result });
  });
}

export const getCashflows = async (saleId: number) => {
  return await db.query.cashflows.findMany({
    where: eq(cashflows.sale_id, saleId),
  });
};
export const getPaymentMethods = async (
  searchText: string | null | undefined,
  asItems: boolean
) => {
  return [
    { id: 1, name: "Mercado Pago" },
    { id: 2, name: "Transferencia" },
    { id: 3, name: "Efectivo" },
    { id: 4, name: "Tarjeta de crédito" },
    { id: 5, name: "Tarjeta de débito" },
  ];
};
