<template>
  <div class="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-black transition-colors duration-300 relative overflow-hidden">
    
    <!-- Main Content -->
    <div class="w-full max-w-[390px] px-8 flex flex-col items-center z-10">
      
      <!-- Logo/Icon -->
      <div class="mb-10">
        <div class="w-20 h-20 rounded-[22px] bg-gradient-to-br from-[#007aff] to-[#0051ff] shadow-[0_0_40px_0_rgba(0,122,255,0.3)] flex items-center justify-center">
          <van-icon name="chat-o" size="40" color="white" />
        </div>
      </div>

      <!-- Welcome Text -->
      <div class="text-center mb-10">
        <h1 class="text-[32px] font-medium text-black dark:text-white mb-2 tracking-tight">
          {{ isRegister ? '创建账号' : '欢迎回来' }}
        </h1>
        <p class="text-base text-gray-500 dark:text-white/50">
          {{ isRegister ? '注册以开始使用 AI 助手' : '登录您的 AI 助手账号' }}
        </p>
      </div>

      <!-- Form -->
      <div class="w-full space-y-4">
        <!-- Username/Email -->
        <div class="w-full h-[60px] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 flex flex-col justify-center transition-all focus-within:border-[#007aff] focus-within:bg-white dark:focus-within:bg-white/10">
          <label class="text-xs text-gray-400 dark:text-white/30 mb-0.5">账号</label>
          <input 
            v-model="username"
            type="text" 
            class="bg-transparent border-none outline-none text-[17px] text-black dark:text-white placeholder-gray-300 dark:placeholder-white/20 p-0 h-6"
            placeholder="请输入邮箱或手机号"
          />
        </div>

        <!-- Password -->
        <div class="w-full h-[60px] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 flex flex-col justify-center transition-all focus-within:border-[#007aff] focus-within:bg-white dark:focus-within:bg-white/10">
          <label class="text-xs text-gray-400 dark:text-white/30 mb-0.5">密码</label>
          <input 
            v-model="password"
            type="password" 
            class="bg-transparent border-none outline-none text-[17px] text-black dark:text-white placeholder-gray-300 dark:placeholder-white/20 p-0 h-6"
            placeholder="请输入密码"
          />
        </div>
        
        <!-- Confirm Password (Register) -->
        <div v-if="isRegister" class="w-full h-[60px] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 flex flex-col justify-center transition-all focus-within:border-[#007aff] focus-within:bg-white dark:focus-within:bg-white/10">
          <label class="text-xs text-gray-400 dark:text-white/30 mb-0.5">确认密码</label>
          <input 
            v-model="confirmPassword"
            type="password" 
            class="bg-transparent border-none outline-none text-[17px] text-black dark:text-white placeholder-gray-300 dark:placeholder-white/20 p-0 h-6"
            placeholder="请再次输入密码"
          />
        </div>

        <!-- Forgot Password -->
        <div class="w-full flex justify-end" v-if="!isRegister">
          <button class="text-[15px] font-medium text-[#007aff]">忘记密码？</button>
        </div>

        <!-- Submit Button -->
        <button 
          @click="onSubmit"
          class="w-full h-[56px] bg-[#007aff] rounded-2xl flex items-center justify-center shadow-[0_10px_15px_-3px_rgba(59,130,246,0.2)] active:scale-95 transition-transform mt-6"
        >
          <span class="text-[17px] font-medium text-white">{{ isRegister ? '注 册' : '登 录' }}</span>
        </button>
      </div>

      <!-- Divider -->
      <div class="w-full flex items-center gap-4 my-10">
        <div class="flex-1 h-[1px] bg-gray-200 dark:bg-white/10"></div>
        <span class="text-xs font-medium text-gray-400 dark:text-white/30 uppercase tracking-wider">或者</span>
        <div class="flex-1 h-[1px] bg-gray-200 dark:bg-white/10"></div>
      </div>

      <!-- Social Login -->
      <div class="w-full space-y-3">
        <button class="w-full h-[54px] bg-black dark:bg-white rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <van-icon name="apple" size="20" class="text-white dark:text-black" />
          <span class="text-[17px] font-bold text-white dark:text-black">通过 Apple 登录</span>
        </button>
        <button class="w-full h-[54px] bg-[#07c160] rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <van-icon name="wechat" size="20" class="text-white" />
          <span class="text-[17px] font-bold text-white">微信快速登录</span>
        </button>
      </div>

    </div>

    <!-- Footer -->
    <div class="absolute bottom-8 left-0 w-full flex flex-col items-center">
      <div class="flex items-center gap-1">
        <span class="text-sm text-gray-400 dark:text-white/40">{{ isRegister ? '已有账号？' : '没有账号？' }}</span>
        <button @click="toggleMode" class="text-sm font-medium text-[#007aff]">{{ isRegister ? '立即登录' : '立即注册' }}</button>
      </div>
      <!-- Home Indicator -->
      <div class="w-32 h-1.5 bg-black/10 dark:bg-white/10 rounded-full mt-8"></div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import { showToast } from 'vant';

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const isRegister = ref(false);

const router = useRouter();
const userStore = useUserStore();

const toggleMode = () => {
  isRegister.value = !isRegister.value;
  username.value = '';
  password.value = '';
  confirmPassword.value = '';
};

const onSubmit = async () => {
  if (!username.value || !password.value) {
    showToast('请输入账号和密码');
    return;
  }

  if (isRegister.value && password.value !== confirmPassword.value) {
    showToast('两次输入的密码不一致');
    return;
  }

  try {
    if (isRegister.value) {
      await userStore.register({
        username: username.value,
        password: password.value,
        confirmPassword: confirmPassword.value
      });
      showToast('注册成功');
      await userStore.login({ username: username.value, password: password.value });
    } else {
      await userStore.login({ username: username.value, password: password.value });
      showToast('登录成功');
    }
    router.replace('/');
  } catch (error) {
    console.error(error);
    showToast(isRegister.value ? '注册失败' : '登录失败');
  }
};
</script>

<style scoped>
/* Custom overrides if needed */
</style>
