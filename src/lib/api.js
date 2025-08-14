import axios from "axios";

export const API_BASE = "https://vaahan-suraksha-backend.vercel.app/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("auth");
  if (stored) {
    const { accessToken } = JSON.parse(stored);
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
export default api;