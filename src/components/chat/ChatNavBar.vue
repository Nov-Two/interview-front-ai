<template>
  <van-nav-bar
    :title="title"
    :left-arrow="showBack"
    @click-left="onClickLeft"
    class="!bg-white dark:!bg-gray-800 !shadow-sm !border-b-0 dark:!text-white transition-colors duration-300"
  >
    <template #right>
      <van-popover
        v-model:show="showMenu"
        :actions="menuActions"
        @select="onSelectMenu"
        placement="bottom-end"
        class="!p-0"
      >
        <template #reference>
          <div class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors cursor-pointer">
            <van-icon name="ellipsis" size="20" class="text-[var(--icon-color)]" />
          </div>
        </template>
      </van-popover>
    </template>
  </van-nav-bar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useThemeStore } from '@/store';
import { useI18n } from 'vue-i18n';
import { useAuth } from '@/composables/useAuth';

defineProps<{
  title: string;
  showBack: boolean;
}>();

const emit = defineEmits(['back']);

const router = useRouter();
const themeStore = useThemeStore();
const { t, locale } = useI18n();
const { checkAuth, logout, isLoggedIn } = useAuth();
const showMenu = ref(false);

const menuActions = computed(() => [
  { text: isLoggedIn() ? t('common.history') : t('common.loginRequired'), icon: 'clock-o', value: 'history' },
  { text: locale.value === 'zh' ? 'English' : '中文', icon: 'exchange', value: 'lang' },
  { text: themeStore.isDark ? t('common.lightMode') || 'Light Mode' : t('common.darkMode') || 'Dark Mode', icon: themeStore.isDark ? 'sunny-o' : 'moon-o', value: 'theme' },
  { text: isLoggedIn() ? t('common.logout') || 'Logout' : t('common.login'), icon: 'user-o', value: 'auth' }
]);

const onClickLeft = () => {
  emit('back');
};

const onSelectMenu = (action: any) => {
  if (action.value === 'history') {
    if (checkAuth()) {
      router.push('/list');
    }
  } else if (action.value === 'lang') {
    locale.value = locale.value === 'zh' ? 'en' : 'zh';
  } else if (action.value === 'theme') {
    themeStore.toggleTheme();
  } else if (action.value === 'auth') {
     if (isLoggedIn()) {
       logout();
     } else {
       router.push('/login');
     }
  }
};
</script>

<style scoped>
:deep(.van-nav-bar__title) {
  font-weight: 600;
  color: inherit;
}
:deep(.van-nav-bar .van-icon) {
  color: inherit;
}
</style>
