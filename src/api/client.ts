import axios, { AxiosError } from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const SELLER_TOKEN_KEY = "zamoyo_seller_token";

function getSellerToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SELLER_TOKEN_KEY);
}

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getSellerToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Token expired or unauthorized.");
      // later:
      // - clear auth state
      // - remove token
      // - redirect seller to login
    }

    return Promise.reject(error);
  },
);