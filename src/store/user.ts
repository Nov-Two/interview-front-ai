import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<{ username: string } | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));

  const login = (username: string) => {
    userInfo.value = { username };
    token.value = 'mock-token-' + Date.now();
    localStorage.setItem('token', token.value);
  };

  const logout = () => {
    userInfo.value = null;
    token.value = null;
    localStorage.removeItem('token');
    // Router push will be handled by the caller or global guard
  };

  const isLoggedIn = () => !!token.value;

  return {
    userInfo,
    token,
    login,
    logout,
    isLoggedIn,
  };
});
