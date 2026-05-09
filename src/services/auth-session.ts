import type { AuthSession, AuthUser } from "@/types/auth";

const ACCESS_TOKEN_KEY = "zamoyo_access_token";
const REFRESH_TOKEN_KEY = "zamoyo_refresh_token";
const AUTH_USER_KEY = "zamoyo_auth_user";
const LAST_AUTH_EMAIL_KEY = "zamoyo_auth_last_email";
const LEGACY_SELLER_TOKEN_KEY = "zamoyo_seller_token";
export const AUTH_SESSION_CHANGED_EVENT = "zamoyo:auth-session-changed";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function readString(key: string): string | null {
  const storage = getStorage();
  if (!storage) return null;

  const value = storage.getItem(key);
  return value && value.trim().length > 0 ? value : null;
}

function notifyAuthSessionChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
}

export function getStoredAccessToken(): string | null {
  return readString(ACCESS_TOKEN_KEY) ?? readString(LEGACY_SELLER_TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  return readString(REFRESH_TOKEN_KEY);
}

export function storeAccessToken(token: string): void {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(ACCESS_TOKEN_KEY, token);
  storage.setItem(LEGACY_SELLER_TOKEN_KEY, token);
}

export function storeRefreshToken(token: string): void {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(REFRESH_TOKEN_KEY, token);
}

export function removeStoredRefreshToken(): void {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(REFRESH_TOKEN_KEY);
}

export function storeLastAuthEmail(email: string): void {
  const storage = getStorage();
  if (!storage || !email.trim()) return;
  storage.setItem(LAST_AUTH_EMAIL_KEY, email.trim());
}

export function getLastAuthEmail(): string {
  return readString(LAST_AUTH_EMAIL_KEY) ?? "";
}

export function storeAuthUser(user: AuthUser): void {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getStoredAuthUser(): AuthUser | null {
  const storage = getStorage();
  if (!storage) return null;

  const value = storage.getItem(AUTH_USER_KEY);
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as AuthUser;
  } catch {
    return null;
  }
}

export function getAuthSessionSnapshot(): string {
  const accessToken = getStoredAccessToken();
  const user = readString(AUTH_USER_KEY);
  return accessToken && user ? `${accessToken}:${user}` : "";
}

export function storeAuthSession(session: AuthSession): void {
  storeAccessToken(session.accessToken);
  if (session.refreshToken) {
    storeRefreshToken(session.refreshToken);
  } else {
    removeStoredRefreshToken();
  }
  storeAuthUser(session.user);
  storeLastAuthEmail(session.user.email);
  notifyAuthSessionChanged();
}

export function clearStoredAuthSession(): void {
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(REFRESH_TOKEN_KEY);
  storage.removeItem(AUTH_USER_KEY);
  storage.removeItem(LEGACY_SELLER_TOKEN_KEY);
  notifyAuthSessionChanged();
}
