// frontend/lib/api.ts
import axios, { AxiosError } from "axios";
import { getStoredToken } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.trim() ||
  "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("401 Unauthorized — token may be expired");
    }

    return Promise.reject(error);
  }
);

export default api;
