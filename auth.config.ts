// auth.config.ts
import { db } from "@/db/config";
import { users } from "@/schemas/user";
import Credentials from "@auth/core/providers/credentials";
import { defineConfig } from "auth-astro";
import { eq } from "drizzle-orm";

export default defineConfig({
  providers: [
    Credentials({
      credentials: {
        email: { label: "email" },
      },
      async authorize({ email }) {
        const user = await db.query.users.findFirst({
          where: eq(users.email, email as string),
        });

        return user ?? null;
      },
    }),
  ],
});
