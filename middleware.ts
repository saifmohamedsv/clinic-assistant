import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  // Define protected paths
  const protectedPaths = ["/home", "/patients", "/appointments", "/records", "/settings"];
  const { pathname } = req.nextUrl;

  // Only check protected paths
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const session = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!session) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/patients/:path*", "/appointments/:path*", "/records/:path*", "/settings/:path*"],
};
