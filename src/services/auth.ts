import { ApiError, apiClient } from "@/services/api";
import {
  clearStoredAuthSession,
  getLastAuthEmail,
  getStoredAccessToken,
  getStoredAuthUser,
  getStoredRefreshToken,
  removeStoredRefreshToken,
  storeAccessToken,
  storeAuthSession,
  storeAuthUser,
  storeLastAuthEmail,
  storeRefreshToken,
} from "@/services/auth-session";
import { simulateRequest } from "@/services/mock";
import type {
  AuthActionResult,
  AuthRole,
  AuthSession,
  AuthUser,
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  PermissionPreferencesInput,
  RegisterInput,
  ResetPasswordInput,
  UpdateMeInput,
  VerifyCodeInput,
} from "@/types/auth";
import type { SellerApplicationInput, SellerApplicationResult } from "@/types/seller";

const AUTH_ENDPOINTS = {
  register: "/auth/register",
  login: "/auth/login",
  logout: "/auth/logout",
  me: "/auth/me",
  refreshToken: "/auth/refresh-token",
  forgotPassword: "/auth/forgot-password",
  verifyCode: "/auth/verify-code",
  resetPassword: "/auth/reset-password",
  updateMe: "/auth/update-me",
  changePassword: "/auth/change-password",
} as const;

const ROLE_REDIRECTS: Record<AuthRole, string> = {
  buyer: "/account",
  seller: "/seller",
  admin: "/seller",
  support: "/seller",
};

const DEFAULT_BUYER_REDIRECT = "/account";

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
  const results: Record<string, unknown>[] = [];
  const queue: unknown[] = [payload];
  const seen = new Set<Record<string, unknown>>();

  while (queue.length > 0) {
    const current = queue.shift();
    const record = asRecord(current);
    if (!record || seen.has(record)) continue;

    seen.add(record);
    results.push(record);

    for (const key of [
      "data",
      "payload",
      "result",
      "user",
      "account",
      "auth",
      "session",
      "tokens",
      "token",
    ]) {
      if (key in record) {
        queue.push(record[key]);
      }
    }
  }

  return results;
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

function normalizeRole(rawRole: string | undefined): AuthRole | undefined {
  if (!rawRole) return undefined;

  const normalized = rawRole.toLowerCase();
  if (normalized.includes("seller") || normalized.includes("vendor")) return "seller";
  if (normalized.includes("admin")) return "admin";
  if (normalized.includes("support")) return "support";
  if (normalized.includes("buyer") || normalized.includes("customer") || normalized.includes("user")) return "buyer";

  return undefined;
}

function splitFullName(name: string): { firstName: string; lastName: string } {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function fallbackNameFromEmail(email: string): string {
  return email.split("@")[0] ?? "";
}

function normalizeUser(payload: unknown, fallbackEmail?: string): AuthUser {
  const records = collectCandidateRecords(payload);
  const email =
    getStringByKeys(records, ["email", "mail"]) ??
    asNonEmptyString(fallbackEmail);

  if (!email) {
    throw new ApiError("Auth response did not include a valid user email.", 500, payload);
  }

  const userId =
    getStringByKeys(records, ["id", "_id", "userId", "uid"]) ??
    email;

  const fullName =
    getStringByKeys(records, ["name", "fullName", "displayName"]) ??
    fallbackNameFromEmail(email);
  const splitName = splitFullName(fullName);

  const firstName =
    getStringByKeys(records, ["firstName", "first_name", "givenName"]) ??
    splitName.firstName;
  const lastName =
    getStringByKeys(records, ["lastName", "last_name", "surname", "familyName"]) ??
    splitName.lastName;

  const role = normalizeRole(
    getStringByKeys(records, ["role", "accountType", "userType"]),
  );

  return {
    id: userId,
    firstName: firstName || "User",
    lastName: lastName || "",
    email,
    role,
    phone: getStringByKeys(records, ["phone", "phoneNumber", "mobile"]),
    avatarUrl: getStringByKeys(records, ["avatarUrl", "avatar", "photoUrl"]),
  };
}

function tryNormalizeUser(payload: unknown, fallbackEmail?: string): AuthUser | null {
  try {
    return normalizeUser(payload, fallbackEmail);
  } catch {
    return null;
  }
}

function extractTokens(payload: unknown): { accessToken: string; refreshToken?: string } {
  const records = collectCandidateRecords(payload);
  const accessToken = getStringByKeys(records, [
    "accessToken",
    "access_token",
    "token",
    "jwt",
  ]);
  const refreshToken = getStringByKeys(records, [
    "refreshToken",
    "refresh_token",
  ]);

  if (!accessToken) {
    throw new ApiError("Auth response did not include an access token.", 500, payload);
  }

  return { accessToken, refreshToken };
}

function sanitizeInternalPath(path?: string | null): string | undefined {
  if (!path) return undefined;

  const normalized = path.trim();
  if (!normalized.startsWith("/") || normalized.startsWith("//")) return undefined;
  if (normalized.startsWith("/auth")) return undefined;

  return normalized;
}

function extractActionMessage(payload: unknown, fallbackMessage: string): string {
  const records = collectCandidateRecords(payload);
  return (
    getStringByKeys(records, ["message", "detail", "statusMessage"]) ??
    fallbackMessage
  );
}

function buildActionResult(
  payload: unknown,
  fallbackMessage: string,
  fallbackPath?: string,
): AuthActionResult {
  const records = collectCandidateRecords(payload);
  const payloadNextPath = sanitizeInternalPath(
    getStringByKeys(records, ["nextPath", "redirectPath", "redirectTo"]),
  );

  return {
    success: true,
    message: extractActionMessage(payload, fallbackMessage),
    nextPath: payloadNextPath ?? sanitizeInternalPath(fallbackPath),
  };
}

function applyTokenUpdate(tokens: { accessToken: string; refreshToken?: string }): void {
  storeAccessToken(tokens.accessToken);

  if (tokens.refreshToken) {
    storeRefreshToken(tokens.refreshToken);
  } else {
    removeStoredRefreshToken();
  }
}

export function getDemoVerificationEmail(): string {
  return getLastAuthEmail();
}

export function getPostLoginRedirectPath(
  user: Pick<AuthUser, "role">,
  preferredPath?: string | null,
): string {
  const safePreferredPath = sanitizeInternalPath(preferredPath);
  if (safePreferredPath) return safePreferredPath;

  if (!user.role) return DEFAULT_BUYER_REDIRECT;
  return ROLE_REDIRECTS[user.role] ?? DEFAULT_BUYER_REDIRECT;
}

export function getStoredAuthSession(): AuthSession | null {
  const accessToken = getStoredAccessToken();
  const user = getStoredAuthUser();

  if (!accessToken || !user) return null;

  const refreshToken = getStoredRefreshToken() ?? undefined;
  return { accessToken, refreshToken, user };
}

export function isAuthenticated(): boolean {
  return Boolean(getStoredAccessToken());
}

export async function login(input: LoginInput): Promise<AuthSession> {
  storeLastAuthEmail(input.email);

  const payload = await apiClient<unknown>(AUTH_ENDPOINTS.login, {
    method: "POST",
    authMode: "omit",
    body: JSON.stringify(input),
  });

  const tokens = extractTokens(payload);
  applyTokenUpdate(tokens);

  let user = tryNormalizeUser(payload, input.email);

  try {
    user = await getCurrentUser();
  } catch (error) {
    if (!user) {
      clearStoredAuthSession();
      throw error;
    }

    storeAuthUser(user);
  }

  const session: AuthSession = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user,
  };

  storeAuthSession(session);
  return session;
}

export async function register(input: RegisterInput): Promise<AuthActionResult> {
  storeLastAuthEmail(input.email);

  const payload = await apiClient<unknown>(AUTH_ENDPOINTS.register, {
    method: "POST",
    authMode: "omit",
    body: JSON.stringify(input),
  });

  return buildActionResult(payload, "Account created successfully.", "/auth/permissions");
}

export async function logout(): Promise<AuthActionResult> {
  try {
    await apiClient<unknown>(AUTH_ENDPOINTS.logout, {
      method: "POST",
    });
  } finally {
    clearStoredAuthSession();
  }

  return {
    success: true,
    message: "Signed out successfully.",
    nextPath: "/auth/login",
  };
}

export async function getCurrentUser(): Promise<AuthUser> {
  const payload = await apiClient<unknown>(AUTH_ENDPOINTS.me, {
    method: "GET",
  });

  const fallbackEmail = getStoredAuthUser()?.email;
  const user = normalizeUser(payload, fallbackEmail);
  storeAuthUser(user);
  storeLastAuthEmail(user.email);
  return user;
}

export async function refreshAccessToken(): Promise<string> {
  const currentRefreshToken = getStoredRefreshToken();
  const refreshBody = currentRefreshToken
    ? { refreshToken: currentRefreshToken }
    : {};

  const payload = await apiClient<unknown>(AUTH_ENDPOINTS.refreshToken, {
    method: "POST",
    authMode: "omit",
    body: JSON.stringify(refreshBody),
  });

  const nextTokens = extractTokens(payload);
  if (!nextTokens.refreshToken && currentRefreshToken) {
    nextTokens.refreshToken = currentRefreshToken;
  }

  applyTokenUpdate(nextTokens);
  return nextTokens.accessToken;
}

export async function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<AuthActionResult> {
  storeLastAuthEmail(input.email);

  const payload = await apiClient<unknown>(AUTH_ENDPOINTS.forgotPassword, {
    method: "POST",
    authMode: "omit",
    body: JSON.stringify(input),
  });

  return buildActionResult(
    payload,
    "Verification code sent.",
    `/auth/verify-code?email=${encodeURIComponent(input.email)}`,
  );
}

export async function verifyResetCode(
  input: VerifyCodeInput,
): Promise<AuthActionResult> {
  const payload = await apiClient<unknown>(AUTH_ENDPOINTS.verifyCode, {
    method: "POST",
    authMode: "omit",
    body: JSON.stringify(input),
  });

  return buildActionResult(
    payload,
    "Code verified.",
    `/auth/reset-password?email=${encodeURIComponent(input.email)}&code=${encodeURIComponent(input.code)}`,
  );
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<AuthActionResult> {
  const payload = await apiClient<unknown>(AUTH_ENDPOINTS.resetPassword, {
    method: "POST",
    authMode: "omit",
    body: JSON.stringify(input),
  });

  return buildActionResult(payload, "Password updated successfully.", "/auth/login");
}

export async function updateMe(input: UpdateMeInput): Promise<AuthUser> {
  const payload = await apiClient<unknown>(AUTH_ENDPOINTS.updateMe, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  const fallbackEmail = getStoredAuthUser()?.email;
  const user = normalizeUser(payload, fallbackEmail);
  storeAuthUser(user);
  return user;
}

export async function changePassword(
  input: ChangePasswordInput,
): Promise<AuthActionResult> {
  const payload = await apiClient<unknown>(AUTH_ENDPOINTS.changePassword, {
    method: "POST",
    body: JSON.stringify(input),
  });

  return buildActionResult(payload, "Password changed successfully.");
}

export async function savePermissionPreferences(
  input: PermissionPreferencesInput,
): Promise<AuthActionResult> {
  void input;

  return {
    success: true,
    message: "Preferences saved.",
    nextPath: "/",
  };
}

export async function submitSellerApplication(
  input: SellerApplicationInput,
): Promise<SellerApplicationResult> {
  void input;
  return simulateRequest(
    {
      success: true as const,
      applicationId: "seller-app-001",
      nextPath: "/seller",
    },
    {
      delay: 900,
      errorRate: 0.04,
      errorMessage: "Failed to submit seller application.",
    },
  );
}
