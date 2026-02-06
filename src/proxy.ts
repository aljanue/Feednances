import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth();

  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/api")) {
    if (
      pathname.startsWith("/api/cron") ||
      pathname.startsWith("/api/health") ||
      pathname.startsWith("/api/telegram/webhook") ||
      pathname.startsWith("/api/auth")
    ) {
      return NextResponse.next();
    }

    if (!session) {
      const apiKey = req.headers.get("x-api-key");
      const secretKey = process.env.API_SECRET_KEY;

      if (!apiKey || apiKey !== secretKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/configuration/:path*",
    "/login",
    "/register",
  ],
};
