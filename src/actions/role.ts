import { getRoles } from "@/db/role";
import { defineAction } from "astro:actions";

const brand = {
  getRoles: defineAction({
    handler: async () => {
      const roles = await getRoles();

      return {
        ok: true,
        data: roles,
      };
    },
  }),
};

export default brand;
