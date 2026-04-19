import { simulateRequest } from "@/services/mock";
import type {
  AuthActionResult,
  AuthSession,
  ForgotPasswordInput,
  LoginInput,
  PermissionPreferencesInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyCodeInput,
} from "@/types/auth";
import type { SellerApplicationInput, SellerApplicationResult } from "@/types/seller";

const DEMO_EMAIL = "banda@example.com";

export async function login(input: LoginInput): Promise<AuthSession> {
  return simulateRequest(
    {
      user: {
        id: "user_1",
        firstName: "John",
        lastName: "Banda",
        email: input.email,
      },
      accessToken: "demo-access-token",
      refreshToken: "demo-refresh-token",
    },
    {
      delay: 650,
      errorRate: 0.04,
      errorMessage: "Failed to sign in.",
    },
  );
}

export async function register(input: RegisterInput): Promise<AuthActionResult> {
  void input;
  return simulateRequest(
    {
      success: true as const,
      message: "Account created successfully.",
      nextPath: "/auth/permissions",
    },
    {
      delay: 700,
      errorRate: 0.04,
      errorMessage: "Failed to create your account.",
    },
  );
}

export async function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<AuthActionResult> {
  return simulateRequest(
    {
      success: true as const,
      message: "Verification code sent.",
      nextPath: `/auth/verify-code?email=${encodeURIComponent(input.email)}`,
    },
    {
      delay: 650,
      errorRate: 0.04,
      errorMessage: "Failed to send reset code.",
    },
  );
}

export async function verifyResetCode(
  input: VerifyCodeInput,
): Promise<AuthActionResult> {
  return simulateRequest(
    {
      success: true as const,
      message: "Code verified.",
      nextPath: `/auth/reset-password?email=${encodeURIComponent(input.email)}&code=${encodeURIComponent(input.code)}`,
    },
    {
      delay: 550,
      errorRate: 0.04,
      errorMessage: "Failed to verify code.",
    },
  );
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<AuthActionResult> {
  void input;
  return simulateRequest(
    {
      success: true as const,
      message: "Password updated successfully.",
      nextPath: "/auth/login",
    },
    {
      delay: 650,
      errorRate: 0.04,
      errorMessage: "Failed to reset password.",
    },
  );
}

export async function savePermissionPreferences(
  input: PermissionPreferencesInput,
): Promise<AuthActionResult> {
  void input;
  return simulateRequest(
    {
      success: true as const,
      message: "Preferences saved.",
      nextPath: "/",
    },
    {
      delay: 450,
      errorRate: 0.03,
      errorMessage: "Failed to save preferences.",
    },
  );
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

export function getDemoVerificationEmail() {
  return DEMO_EMAIL;
}
