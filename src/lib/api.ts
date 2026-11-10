import axios from "axios";

// Base API configuration
export const api = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
  },
});

// Attach Sanctum Bearer token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ava_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for 401 unauthenticated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ava_admin_token");
      localStorage.removeItem("ava_admin_user");
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export const rupiah = (value?: number | null) => {
  if (value === null || value === undefined) return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export const getImageUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/")) {
    return path;
  }
  return `/${path}`;
};
