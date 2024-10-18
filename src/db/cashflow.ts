import { cashflows, type InsertCashflow } from "@/schemas/cashflow";
import { db } from ".";
import { eq } from "drizzle-orm";
import { sales } from "@/schemas/sale";

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
  const payment_methods = [
    { id: 1, name: "Mercado Pago" },
    { id: 2, name: "Transferencia" },
    { id: 3, name: "Efectivo" },
    { id: 4, name: "Tarjeta de crédito" },
    { id: 5, name: "Tarjeta de débito" },
  ];

  if (!!searchText) {
    return payment_methods.filter((pm) =>
      pm.name.toLocaleLowerCase().includes(searchText.toLowerCase())
    );
  }

  return payment_methods;
};
