import axios from "axios";

export const TOKEN_KEY = "restro_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Attach the JWT as a Bearer token on every request. This is the primary auth
// transport (works reliably even when the frontend and API are on different
// domains, where browsers often block the httpOnly cookie as third-party).
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // localStorage may be unavailable (private browsing, etc.) - cookie auth still applies
  }
  return config;
});

// Centralized error message extraction so components can just read err.message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;
