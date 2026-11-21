import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1212";

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("anilume-access-token");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Ưu tiên thông báo do backend trả về để form hiển thị đúng lỗi (409, 401, 403...).
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      error.message = String(error.response.data.message);
    }

    const originalRequest = error.config as (NonNullable<typeof error.config> & { _retry?: boolean }) | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !String(originalRequest.url || "").includes("/auth/")
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh");
        localStorage.setItem("anilume-access-token", response.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem("anilume-access-token");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
