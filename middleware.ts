import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Compose next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only handle locale-prefixed routes (ar|en)
  const localeMatch = pathname.match(/^\/(ar|en)(\/|$)/);
  if (!localeMatch) {
    // Not a locale-prefixed route, let Next.js handle (should not match due to matcher)
    return NextResponse.next();
  }

  // Auth-protected locale-aware paths
  const protectedPaths = ["/home", "/patients", "/appointments", "/records", "/settings"];
  const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, "");

  if (protectedPaths.some((path) => pathWithoutLocale.startsWith(path))) {
    const session = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!session) {
      // Redirect to locale-aware sign-in page
      const locale = pathname.split("/")[1] || "ar";
      const signInUrl = new URL(`/${locale}/sign-in`, req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Always run next-intl middleware for locale-prefixed routes
  const response = intlMiddleware(req);
  if (response) return response;

  return NextResponse.next();
}

export const config = {
  matcher: ["/(ar|en)/:path*"],
};
