import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// Edge-compatible config — no Prisma, no Node.js-only modules.
// Used by middleware to check session without hitting the DB.
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Stub — real authorize runs in auth.ts on the Node.js runtime
      authorize: async () => null,
    }),
  ],
  pages: { signIn: "/login" },
};
