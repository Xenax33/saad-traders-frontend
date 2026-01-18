import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import Cookies from 'js-cookie';

/**
 * Axios instance configuration
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * Add authentication token or other headers here
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const accessToken = Cookies.get('accessToken');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Token refresh handling
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Response interceptor
 * Handle common error responses and token refresh
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get('refreshToken');

      if (!refreshToken) {
        // No refresh token, redirect to login
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data.data;
        Cookies.set('accessToken', accessToken, { expires: 1, secure: true, sameSite: 'strict' });

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        isRefreshing = false;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        isRefreshing = false;

        // Refresh failed, clear tokens and redirect to login
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden");
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error("Server error occurred");
    }

    return Promise.reject(error);
  }
);

/**
 * API request wrapper with error handling
 */
export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config),
};

export default axiosInstance;
