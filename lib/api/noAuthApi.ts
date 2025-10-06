// lib/api/noAuthApi.ts
import axios from "axios";

const noAuthApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.afrovending.com/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export default noAuthApi;
