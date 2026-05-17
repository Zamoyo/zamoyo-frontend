import { NextResponse } from "next/server";
import type { AdminAuthStrength, AdminIdentity } from "@/services/admin/session";
import type { AdminRole, Permission } from "@/services/rbac";
import {
  ADMIN_DASHBOARD_PATH,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from "@/services/admin/session-cookie";

const ADMIN_LOGIN_ENDPOINT =
  process.env.ADMIN_AUTH_LOGIN_ENDPOINT ?? "/admin/auth/login";
const BACKEND_BASE_URL =
  process.env.ADMIN_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/api/v1";

const ADMIN_ROLES: readonly AdminRole[] = [
  "super_admin",
  "executive_admin",
  "ops_manager",
  "finance_admin",
  "support_admin",
  "content_admin",
  "viewer",
];

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function collectCandidateRecords(payload: unknown): Record<string, unknown>[] {
  const records: Record<string, unknown>[] = [];
  const queue: unknown[] = [payload];
  const seen = new Set<Record<string, unknown>>();

  while (queue.length > 0) {
    const record = asRecord(queue.shift());
    if (!record || seen.has(record)) continue;

    seen.add(record);
    records.push(record);

    for (const key of ["data", "payload", "result", "admin", "user", "identity", "session", "tokens"]) {
      if (key in record) queue.push(record[key]);
    }
  }

  return records;
}

function getStringByKeys(
  records: Record<string, unknown>[],
  keys: readonly string[],
): string | undefined {
  for (const record of records) {
    for (const key of keys) {
      const value = asNonEmptyString(record[key]);
      if (value) return value;
    }
  }

  return undefined;
}

function getPermissions(records: Record<string, unknown>[]): Permission[] | undefined {
  for (const record of records) {
    const permissions = record.permissions;
    if (!Array.isArray(permissions)) continue;

    const normalized = permissions.filter(
      (permission): permission is Permission => typeof permission === "string",
    );
    if (normalized.length > 0) return normalized;
  }

  return undefined;
}

function normalizeAdminRole(rawRole: string | undefined): AdminRole | undefined {
  if (!rawRole) return undefined;
  const normalized = rawRole.trim().toLowerCase().replaceAll("-", "_");
  return ADMIN_ROLES.find((role) => role === normalized);
}

function normalizeAuthStrength(value: string | undefined): AdminAuthStrength {
  if (value === "passkey_ready" || value === "mfa_ready" || value === "password") {
    return value;
  }

  return "password";
}

function buildBackendUrl(endpoint: string): string {
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  const normalizedBase = BACKEND_BASE_URL.replace(/\/$/, "");
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${normalizedBase}${normalizedEndpoint}`;
}

async function parseBackendResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  return contentType?.includes("application/json") ? response.json() : response.text();
}

function getBackendMessage(payload: unknown, fallback: string): string {
  const records = collectCandidateRecords(payload);
  return getStringByKeys(records, ["message", "detail", "error"]) ?? fallback;
}

function extractAdminSessionToken(payload: unknown): string | undefined {
  const records = collectCandidateRecords(payload);
  return getStringByKeys(records, [
    "adminSessionToken",
    "sessionToken",
    "accessToken",
    "access_token",
    "token",
    "jwt",
  ]);
}

function getSetCookieHeaders(headers: Headers): string[] {
  const withGetSetCookie = headers as Headers & { getSetCookie?: () => string[] };
  const setCookies = withGetSetCookie.getSetCookie?.();
  if (setCookies?.length) return setCookies;

  const setCookie = headers.get("set-cookie");
  return setCookie ? [setCookie] : [];
}

function extractSessionTokenFromSetCookie(headers: Headers): string | undefined {
  const cookieHeaders = getSetCookieHeaders(headers);
  const sessionNames = [
    ADMIN_SESSION_COOKIE,
    "admin_session",
    "adminSession",
    "session",
    "accessToken",
    "access_token",
  ];

  for (const cookieHeader of cookieHeaders) {
    const [nameValue] = cookieHeader.split(";");
    const separatorIndex = nameValue.indexOf("=");
    if (separatorIndex === -1) continue;

    const name = nameValue.slice(0, separatorIndex).trim();
    const value = decodeURIComponent(nameValue.slice(separatorIndex + 1).trim());
    if (sessionNames.includes(name) && value) return value;
  }

  return undefined;
}

function buildAdminIdentity(payload: unknown, fallbackEmail: string): AdminIdentity | undefined {
  const records = collectCandidateRecords(payload);
  const role = normalizeAdminRole(getStringByKeys(records, ["role", "adminRole"]));
  if (!role) return undefined;

  const email = getStringByKeys(records, ["email", "mail"]) ?? fallbackEmail;
  const name =
    getStringByKeys(records, ["name", "fullName", "displayName"]) ??
    email.split("@")[0] ??
    "Admin";

  return {
    id: getStringByKeys(records, ["id", "_id", "adminId", "userId"]) ?? email,
    name,
    email,
    claims: {
      role,
      permissions: getPermissions(records),
      authStrength: normalizeAuthStrength(
        getStringByKeys(records, ["authStrength", "assuranceLevel"]),
      ),
      issuedAt: new Date().toISOString(),
    },
    sessionStatus: "authenticated",
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = asNonEmptyString(asRecord(body)?.email)?.toLowerCase();
  const password = asNonEmptyString(asRecord(body)?.password);

  if (!email || !password) {
    return NextResponse.json(
      { message: "Enter your admin credentials." },
      { status: 400 },
    );
  }

  const backendResponse = await fetch(buildBackendUrl(ADMIN_LOGIN_ENDPOINT), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  const payload = await parseBackendResponse(backendResponse);

  if (!backendResponse.ok) {
    return NextResponse.json(
      {
        message: getBackendMessage(
          payload,
          "Admin authentication failed. Check your credentials and try again.",
        ),
      },
      { status: backendResponse.status },
    );
  }

  const token =
    extractAdminSessionToken(payload) ??
    extractSessionTokenFromSetCookie(backendResponse.headers);

  if (!token) {
    return NextResponse.json(
      { message: "Admin backend did not return a session token." },
      { status: 502 },
    );
  }

  const response = NextResponse.json({
    success: true,
    message: "Admin session established.",
    nextPath: ADMIN_DASHBOARD_PATH,
    identity: buildAdminIdentity(payload, email),
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  return response;
}
