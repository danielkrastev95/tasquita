import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Primera barrera (optimista, sin BD): sin cookie de sesión no se entra al panel.
 * La verificación real (sesión válida + 2FA activo) se hace en servidor con requireAdmin().
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isPublicAdminRoute = pathname === "/admin/login";

  if (!isPublicAdminRoute && !getSessionCookie(request)) {
    const url = new URL("/admin/login", request.url);
    // Vuelve a la página pedida tras entrar (el login valida que sea una ruta interna del panel).
    if (pathname !== "/admin" && pathname !== "/admin/") url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
