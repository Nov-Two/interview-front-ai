import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { showToast } from 'vant';
import { useUserStore } from '@/store';
import i18n from '@/i18n';

// Define standard response structure
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

class Request {
  private instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);

    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const userStore = useUserStore();
        if (userStore.token) {
          config.headers.Authorization = `Bearer ${userStore.token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { code, message, data } = response.data;
        // Assume 200 is success code, adjust based on actual backend
        if (code === 200) {
          return data; // Return pure data
        } else {
          showToast(message || 'Error');
          return Promise.reject(new Error(message || 'Error'));
        }
      },
      (error: AxiosError) => {
        let message = '';
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 401:
              message = i18n.global.t('common.loginRequired');
              const userStore = useUserStore();
              userStore.logout();
              // Router redirection should be handled by store or router guard
              break;
            case 403:
              message = 'Forbidden';
              break;
            case 404:
              message = 'Not Found';
              break;
            case 500:
              message = 'Internal Server Error';
              break;
            default:
              message = `Error: ${status}`;
          }
        } else {
          message = error.message || 'Network Error';
        }
        showToast(message);
        return Promise.reject(error);
      }
    );
  }

  // Encapsulated generic request methods
  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request<any, T>(config);
  }

  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<any, T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<any, T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<any, T>(url, data, config);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<any, T>(url, config);
  }
}

// Export a default instance
const request = new Request({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default request;
