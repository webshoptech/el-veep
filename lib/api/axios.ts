import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

// Create axios instance
let api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.afrovending.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Wrap axios with cache
api = setupCache(api, {
  ttl: 1000 * 60 * 60, // 1 hour in ms
});

// Attach auth token if available
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
