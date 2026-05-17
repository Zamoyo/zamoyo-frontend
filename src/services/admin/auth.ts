import { ApiError } from "@/services/api";
import type { AdminIdentity } from "@/services/admin/session";

export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface AdminAuthResult {
  success: true;
  message: string;
  nextPath: string;
  identity?: AdminIdentity;
}

async function parseAuthResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) return response.json();
  return response.text();
}

function extractAuthMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
}

async function requestAdminAuth<T>(
  endpoint: "login" | "logout",
  init: RequestInit,
): Promise<T> {
  const response = await fetch(`/api/admin/auth/${endpoint}`, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const payload = await parseAuthResponse(response);

  if (!response.ok) {
    throw new ApiError(
      extractAuthMessage(payload, "Admin authentication failed."),
      response.status,
      payload,
    );
  }

  return payload as T;
}

export function loginAdmin(input: AdminLoginInput): Promise<AdminAuthResult> {
  return requestAdminAuth<AdminAuthResult>("login", {
    method: "POST",
    body: JSON.stringify({
      email: input.email.trim().toLowerCase(),
      password: input.password,
    }),
  });
}

export function logoutAdmin(): Promise<AdminAuthResult> {
  return requestAdminAuth<AdminAuthResult>("logout", { method: "POST" });
}
