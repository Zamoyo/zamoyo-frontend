import { getStoredAccessToken } from "@/services/auth-session";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

interface FetchOptions extends RequestInit {
  timeout?: number;
  query?: Record<string, string | number | boolean | null | undefined>;
  authMode?: "include" | "omit";
}

function buildUrl(endpoint: string, query?: FetchOptions["query"]): string {
  const url = new URL(`${BASE_URL}${endpoint}`);

  if (!query) return url.toString();

  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) continue;
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

function isJsonResponse(contentType: string | null): boolean {
  return contentType?.includes("application/json") ?? false;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  const {
    timeout = 10_000,
    query,
    authMode = "include",
    headers,
    body,
    ...fetchOptions
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const resolvedHeaders = new Headers(headers);
  if (!resolvedHeaders.has("Accept")) {
    resolvedHeaders.set("Accept", "application/json");
  }

  if (authMode === "include" && !resolvedHeaders.has("Authorization")) {
    const token = getStoredAccessToken();
    if (token) {
      resolvedHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const hasBody = body !== undefined && body !== null;

  if (hasBody && !isFormData && !resolvedHeaders.has("Content-Type")) {
    resolvedHeaders.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(buildUrl(endpoint, query), {
      ...fetchOptions,
      body,
      headers: resolvedHeaders,
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type");
    const hasJsonBody = isJsonResponse(contentType);
    const isNoContent = response.status === 204;

    let responseData: unknown = null;

    if (!isNoContent) {
      responseData = hasJsonBody ? await response.json() : await response.text();
    }

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Unauthorized: token expired or missing.");
      }

      const message =
        typeof responseData === "object" &&
        responseData !== null &&
        "message" in responseData &&
        typeof (responseData as { message?: unknown }).message === "string"
          ? (responseData as { message: string }).message
          : `Backend returned ${response.status}`;

      throw new ApiError(message, response.status, responseData);
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(
        "Request timed out. Please check your connection.",
        408,
      );
    }

    console.error("API Client Error:", error);
    throw new ApiError("Network connection failed.", 503, error);
  } finally {
    clearTimeout(timeoutId);
  }
}
