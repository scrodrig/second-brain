import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";

// Use edge-compatible auth (no Prisma) for middleware session checks
const { auth } = NextAuth(authConfig);
const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  const isAuthRoute = /^\/(en|es|pt)?\/?(login|register)/.test(pathname);

  if (!isLoggedIn && !isAuthRoute) {
    const loginUrl = new URL("/login", req.nextUrl);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(req);
});

export const config = {
  // Exclude API routes and static assets — let Next.js handle them directly
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
