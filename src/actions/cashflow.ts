import {
  createCashflow,
  getCashflows,
  getPaymentMethods,
  updateCashflow,
} from "@/db/config";
import { cashflowFormSchema } from "@/schemas/cashflow";
import { defineAction } from "astro:actions";
import { z } from "zod";

const cashflow = {
  getCashflows: defineAction({
    input: z.object({ saleId: z.number() }),
    handler: async ({ saleId }) => {
      try {
        const cashflows = await getCashflows(saleId);

        console.log({ cashflows });

        return {
          ok: true,
          data: cashflows || [],
          message: "",
        };
      } catch (error) {
        const my_error = error as Error;
        return { ok: false, data: [], message: my_error.message || "" };
      }
    },
  }),
  createCashflow: defineAction({
    input: cashflowFormSchema,
    handler: async (data) => {
      try {
        console.log({ data });
        const result = await createCashflow({
          ...data,
          method: Array.isArray(data.method) ? data.method[0].name : "",
        });
        console.log({ result });

        return {
          ok: true,
          data: [],
          message: "Cobro creado con éxito",
        };
      } catch (error) {
        console.log({ error });
        if (error instanceof Error)
          return { ok: false, message: error.message };
      }
    },
  }),
  updateCashflow: defineAction({
    input: cashflowFormSchema,
    handler: async (data) => {
      try {
        console.log({
          data,
          method: Array.isArray(data.method) ? data.method[0].name : "",
        });
        const result = await updateCashflow({
          ...data,
          method: Array.isArray(data.method) ? data.method[0].name : "",
        });
        console.log({ result });

        return {
          ok: true,
          data: [],
          message: "Usuario creado con éxito",
        };
      } catch (error) {
        console.log({ error });
        if (error instanceof Error)
          return { ok: false, message: error.message };
      }
    },
  }),
  getPaymentMethods: defineAction({
    handler: async (data) => {
      try {
        console.log({ data });
        const payment_methods = await getPaymentMethods("", false);
        console.log({ payment_methods });

        return {
          ok: true,
          data: payment_methods,
          message: "",
        };
      } catch (error) {
        console.log({ error });
        if (error instanceof Error)
          return { ok: false, message: error.message };
      }
    },
  }),
};

export default cashflow;
