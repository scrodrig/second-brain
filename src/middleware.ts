import { auth } from "@/lib/auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  // Strip locale prefix for auth check
  const isAuthRoute = /^\/(en|es|pt)?\/?(login|register)/.test(pathname);
  const isPublicRoute = isAuthRoute;

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", req.nextUrl);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(req);
});

export const config = {
  // Exclude API routes and static assets — let Next.js handle them directly
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
