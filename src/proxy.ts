import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_DASHBOARD_PATH,
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE,
} from "@/services/admin/session-cookie";
import { validateAdminSessionToken } from "@/services/admin/backend-session";

function clearAdminSession(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    const isLoginPage = path === ADMIN_LOGIN_PATH;
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const identity = await validateAdminSessionToken(token);
    const hasSession = Boolean(identity);

    if (!hasSession && !isLoginPage) {
      return clearAdminSession(
        NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url)),
      );
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
