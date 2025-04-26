import { type AxiosInstance } from "axios";
import useAuthStore from "../stores/auth.store";

export const addAuthInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use((config) => {
    const { token } = useAuthStore();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore().logout();
      }
      return Promise.reject(error);
    },
  );

  return axiosInstance;
};
