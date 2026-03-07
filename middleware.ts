import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add pathname to headers for layout detection
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  // Protect all /admin routes except login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = await auth();

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return response;
  }

  // Protect all /api/admin routes
  if (pathname.startsWith("/api/admin")) {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
