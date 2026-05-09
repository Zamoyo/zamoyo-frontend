import {
  hasPermission,
  MOCK_CURRENT_ADMIN,
  type AdminRole,
  type Permission,
} from "@/services/rbac";

export const ADMIN_SESSION_COOKIE = "zamoyo_admin_session";

export type AdminAuthStrength = "password" | "mfa_ready" | "passkey_ready";
export type AdminSessionStatus = "authenticated" | "expired" | "unauthorized";

export interface AdminIdentityClaims {
  role: AdminRole;
  permissions?: Permission[];
  authStrength: AdminAuthStrength;
  issuedAt: string;
}

export interface AdminIdentity {
  id: string;
  name: string;
  email: string;
  claims: AdminIdentityClaims;
  sessionStatus: AdminSessionStatus;
}

export const CURRENT_ADMIN_IDENTITY: AdminIdentity = {
  id: MOCK_CURRENT_ADMIN.id,
  name: MOCK_CURRENT_ADMIN.name,
  email: "danny@zamoyo.com",
  claims: {
    role: MOCK_CURRENT_ADMIN.role,
    authStrength: "mfa_ready",
    issuedAt: "2026-05-01T08:00:00Z",
  },
  sessionStatus: "authenticated",
};

export function getCurrentAdminRole() {
  return CURRENT_ADMIN_IDENTITY.claims.role;
}

export function adminHasPermission(permission: Permission) {
  return hasPermission(getCurrentAdminRole(), permission);
}

export function getAdminInitials(name = CURRENT_ADMIN_IDENTITY.name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function buildAdminSessionCookie(token: string, isHttps: boolean) {
  const secureFlag = isHttps ? "; Secure" : "";
  return `${ADMIN_SESSION_COOKIE}=${token}; path=/; max-age=86400; SameSite=Strict${secureFlag}`;
}

export function clearAdminSessionCookie() {
  return `${ADMIN_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Strict`;
}
