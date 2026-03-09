import axios from "axios";

// This pulls the URL from your .env file, or defaults to your friend's local Fastify server
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // We'll add auth token interceptors here later when your friend builds the login
});