import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

let api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.afrovending.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,  
});

api = setupCache(api, {
  ttl: 1000 * 60 * 60,  
});

export default api;
