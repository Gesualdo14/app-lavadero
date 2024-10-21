import { getReports } from "@/db/report";
import { defineAction } from "astro:actions";
import { z } from "zod";

const report = {
  getReports: defineAction({
    input: z.object({ searchText: z.string().nullish() }),
    handler: async ({ searchText }, { locals }) => {
      try {
        const reports = await getReports();

        return {
          ok: true,
          data: reports,
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
