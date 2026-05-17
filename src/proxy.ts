import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_DASHBOARD_PATH,
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE,
  isUsableAdminSessionToken,
} from "@/services/admin/session-cookie";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    const isLoginPage = path === ADMIN_LOGIN_PATH;
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const hasSession = isUsableAdminSessionToken(token);

    if (!hasSession && !isLoginPage) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
    }

    if (hasSession && isLoginPage) {
      return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
