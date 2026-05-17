import { NextResponse } from "next/server";
import {
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE,
} from "@/services/admin/session-cookie";
import {
  ADMIN_BACKEND_ENDPOINTS,
  buildBackendUrl,
  getBackendCsrfHeaders,
} from "@/services/admin/backend-session";

export async function POST(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`))
    ?.slice(ADMIN_SESSION_COOKIE.length + 1);

  if (token) {
    const csrfHeaders = await getBackendCsrfHeaders().catch(() => ({}));

    await fetch(buildBackendUrl(ADMIN_BACKEND_ENDPOINTS.logout), {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${decodeURIComponent(token)}`,
        ...csrfHeaders,
      },
      cache: "no-store",
    }).catch(() => null);
  }

  const response = NextResponse.json({
    success: true,
    message: "Admin session ended.",
    nextPath: ADMIN_LOGIN_PATH,
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
