import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    // Keep Google from authConfig, override Credentials with full DB logic
    authConfig.providers[0],
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user?.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        return isValid ? user : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.id) {
        const existing = await prisma.householdMember.findFirst({
          where: { userId: user.id },
        });
        if (!existing) {
          const household = await prisma.household.create({
            data: { name: `${user.name}'s Household` },
          });
          await prisma.householdMember.create({
            data: {
              userId: user.id,
              householdId: household.id,
              role: "OWNER",
            },
          });
        }
      }
      return true;
    },
  },
});
