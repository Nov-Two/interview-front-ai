import request from './request';

// DTOs based on Swagger
export interface LoginDto {
  username: string;
  password?: string;
}

export interface RegisterDto {
  username: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginResponse {
  access_token: string;
  accessToken?: string; // Compatible
}

export const authApi = {
  login(data: LoginDto) {
    return request.post<LoginResponse>('/auth/login', data);
  },
  
  register(data: RegisterDto) {
    return request.post<void>('/auth/register', data);
  },
};
