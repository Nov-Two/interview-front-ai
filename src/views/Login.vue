<template>
  <div class="min-h-screen w-full bg-gray-100 dark:bg-black transition-colors duration-300">
    <!-- Toggles (Top Right) - High Z-index to sit above Popup Overlay -->
    <div class="fixed top-4 right-4 flex gap-2 z-[3000]">
      <!-- Theme Toggle -->
      <!-- <button 
        @click="themeStore.toggleTheme"
        class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium text-gray-700 dark:text-white hover:bg-white/30 transition-colors shadow-sm border border-white/10"
      >
        <van-icon :name="themeStore.isDark ? 'sunny' : 'moon-o'" />
      </button> -->
      
      <!-- Language Toggle -->
      <!-- <button 
        @click="toggleLang"
        class="px-3 py-1 bg-black/10 dark:bg-white/20 backdrop-blur-md rounded-full text-sm font-medium text-gray-700 dark:text-white hover:bg-black/20 dark:hover:bg-white/30 transition-colors shadow-sm border border-black/5 dark:border-white/10"
      >
        {{ locale === 'zh' ? 'En' : '中文' }}
      </button> -->
    </div>

    <!-- Login Modal using Vant Popup -->
    <van-popup 
      v-model:show="show" 
      round
      :close-on-click-overlay="false"
      class="!bg-transparent !shadow-none !overflow-visible"
      :overlay-style="{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }"
    >
      <div class="w-[340px] bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in-up transition-colors duration-300">
  
        <div class="p-8 pt-10">
          <!-- Title -->
          <h2 class="text-xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {{ isRegister ? $t('common.registerTitle') : $t('common.loginTitle') }}
          </h2>
  
          <van-form @submit="onSubmit">
            <div class="space-y-4">
              <!-- Username Input -->
              <div class="bg-gray-50 dark:bg-[#2c2c2c] rounded-xl px-4 border border-transparent focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all flex items-center h-12">
                 <van-field
                  v-model="username"
                  name="username"
                  :placeholder="$t('common.usernamePlaceholder')"
                  :rules="[{ required: true, message: '' }]"
                  class="!bg-transparent !p-0 flex-1"
                  :border="false"
                >
                  <template #left-icon>
                     <div class="flex items-center h-full mr-3">
                       <span class="text-gray-500 dark:text-gray-400 font-medium select-none text-sm whitespace-nowrap">{{ $t('common.accountLabel') }}</span>
                       <div class="w-[1px] h-4 bg-gray-300 dark:bg-gray-600 ml-3"></div>
                     </div>
                  </template>
                </van-field>
              </div>
  
              <!-- Password Input -->
              <div class="bg-gray-50 dark:bg-[#2c2c2c] rounded-xl px-4 border border-transparent focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all flex items-center h-12">
                 <van-field
                  v-model="password"
                  type="password"
                  name="password"
                  :placeholder="$t('common.passwordPlaceholder')"
                  :rules="[{ required: true, message: '' }]"
                  class="!bg-transparent !p-0 flex-1"
                  :border="false"
                >
                  <template #left-icon>
                     <div class="flex items-center h-full mr-3">
                       <span class="text-gray-500 dark:text-gray-400 font-medium select-none text-sm whitespace-nowrap">{{ $t('common.passwordLabel') }}</span>
                       <div class="w-[1px] h-4 bg-gray-300 dark:bg-gray-600 ml-3"></div>
                     </div>
                  </template>
                </van-field>
              </div>
              
              <!-- Confirm Password (Register Only) -->
               <div v-if="isRegister" class="bg-gray-50 dark:bg-[#2c2c2c] rounded-xl px-4 border border-transparent focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all flex items-center h-12">
                 <van-field
                  v-model="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  :placeholder="$t('common.confirmPasswordPlaceholder')"
                  :rules="[{ required: true, message: '' }, { validator: validateConfirmPassword, message: $t('common.passwordMismatch') }]"
                  class="!bg-transparent !p-0 flex-1"
                  :border="false"
                >
                  <template #left-icon>
                     <div class="flex items-center h-full mr-3">
                       <span class="text-gray-500 dark:text-gray-400 font-medium select-none text-sm whitespace-nowrap">{{ $t('common.confirmLabel') }}</span>
                       <div class="w-[1px] h-4 bg-gray-300 dark:bg-gray-600 ml-3"></div>
                     </div>
                  </template>
                </van-field>
              </div>
            </div>
  
            <!-- Submit Button -->
            <div class="mt-8">
              <button 
                type="submit"
                class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all duration-200 text-[15px]"
              >
                {{ isRegister ? $t('common.register') : $t('common.loginBtn') }}
              </button>
            </div>
          </van-form>
  
          <!-- Terms Agreement -->
          <div class="mt-4 flex items-start gap-2 justify-center">
             <van-checkbox v-model="agreed" icon-size="14px" checked-color="#3b82f6" class="mt-0.5">
               <span class="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">
                 {{ $t('common.agreeTo') }} 
                 <a href="#" class="text-gray-600 dark:text-gray-400 hover:underline">{{ $t('common.userAgreement') }}</a>
                 &
                 <a href="#" class="text-gray-600 dark:text-gray-400 hover:underline">{{ $t('common.privacyPolicy') }}</a>
               </span>
             </van-checkbox>
          </div>
  
          <!-- Toggle Login/Register -->
          <div class="mt-8 text-center">
            <button 
              @click="toggleMode"
              class="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
            >
              {{ isRegister ? $t('common.hasAccount') : $t('common.noAccount') }}
            </button>
          </div>
          
          <!-- Third Party Login (Douyin Style) -->
          <div class="mt-8 flex justify-center">
             <div class="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700 shadow-sm">
               <van-icon name="fire" class="text-gray-400 dark:text-gray-500" />
             </div>
          </div>
  
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore, useThemeStore } from '@/store';
import { showToast } from 'vant';
import { useI18n } from 'vue-i18n';

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreed = ref(false);
const isRegister = ref(false);
const show = ref(true);

const router = useRouter();
const userStore = useUserStore();
const themeStore = useThemeStore();
const { t, locale } = useI18n();

const toggleLang = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh';
};

const toggleMode = () => {
  isRegister.value = !isRegister.value;
  username.value = '';
  password.value = '';
  confirmPassword.value = '';
};

const validateConfirmPassword = (val: string) => {
  return val === password.value;
};

const onSubmit = (values: any) => {
  if (!agreed.value) {
    showToast(t('common.agreeRequired'));
    return;
  }

  if (isRegister.value) {
    // Mock Register
    if (username.value && password.value) {
      showToast(t('common.registerSuccess'));
      // Auto login after register or switch to login? Let's auto login for better UX
      userStore.login(username.value);
      router.replace('/');
    }
  } else {
    // Login
    if (username.value && password.value) {
      userStore.login(username.value);
      showToast(t('common.loginSuccess'));
      router.replace('/');
    }
  }
};
</script>

<style scoped>
/* Fade In Up Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Vant Overrides */
:deep(.van-cell) {
  padding: 0;
  background: transparent;
}
:deep(.van-field__control) {
  color: #1f2937;
  font-size: 14px;
}
.dark :deep(.van-field__control) {
  color: #e5e7eb;
}
:deep(.van-field__control::placeholder) {
  color: #9ca3af;
}
</style>
