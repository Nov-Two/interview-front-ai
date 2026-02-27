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
      (response: AxiosResponse<any>) => {
        const { status } = response;
        const resData = response.data;
        
        // Check if the backend wraps response in { code, message, data }
        if (resData && typeof resData.code === 'number') {
           if (resData.code === 200 || resData.code === 201) {
             return resData.data;
           } else {
             showToast(resData.message || 'Error');
             return Promise.reject(new Error(resData.message || 'Error'));
           }
        }
        
        // If standard REST response (status 2xx) without wrapper
        if (status >= 200 && status < 300) {
          return resData;
        }
        
        return Promise.reject(new Error('Unknown Error'));
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
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default request;
