import { getReports } from "@/db/report";
import { defineAction } from "astro:actions";
import { z } from "zod";

const report = {
  getReports: defineAction({
    handler: async () => {
      try {
        const sales = await getReports("sale");
        const cashflows = await getReports("cashflow");

        return {
          ok: true,
          data: [sales, cashflows],
          message: "",
        };
      } catch (error) {
        const my_error = error as Error;
        return { ok: false, data: [], message: my_error.message || "" };
      }
    },
  }),
};

export default report;
