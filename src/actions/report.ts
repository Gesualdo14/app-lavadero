import { getSalesReport } from "@/db/report";
import { defineAction } from "astro:actions";

const report = {
  getReports: defineAction({
    handler: async () => {
      try {
        const sales = await getSalesReport();
        console.log({ sales });
        return {
          ok: true,
          data: sales,
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
