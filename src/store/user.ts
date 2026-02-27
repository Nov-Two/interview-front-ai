import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authApi, LoginDto, RegisterDto } from '@/api/auth';

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<{ username: string } | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));

  const login = async (data: LoginDto) => {
    try {
      const res = await authApi.login(data);
      // Adjust based on actual backend response structure
      // The backend returns { access_token: "..." } in the data field
      const accessToken = (res as any).access_token || (res as any).accessToken || (res as any).data?.access_token || (res as any).data?.accessToken;
      
      if (accessToken) {
        token.value = accessToken;
        localStorage.setItem('token', accessToken);
        userInfo.value = { username: data.username };
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      await authApi.register(data);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    userInfo.value = null;
    token.value = null;
    localStorage.removeItem('token');
  };

  const isLoggedIn = () => !!token.value;

  return {
    userInfo,
    token,
    login,
    register,
    logout,
    isLoggedIn,
  };
});
