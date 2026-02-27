import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import { showDialog } from 'vant';
import { useI18n } from 'vue-i18n';

export function useAuth() {
  const router = useRouter();
  const userStore = useUserStore();
  const { t } = useI18n();

  const checkAuth = () => {
    if (!userStore.isLoggedIn()) {
      showDialog({
        title: t('common.loginRequired'),
        message: t('common.loginRequiredMsg'),
        confirmButtonText: t('common.goToLogin'),
        showCancelButton: true,
      })
        .then(() => {
          router.push('/login');
        })
        .catch(() => {
          // cancel
        });
      return false;
    }
    return true;
  };

  const logout = () => {
    userStore.logout();
    showToast(t('common.loggedOut') || 'Logged out');
    router.push('/login');
  };

  return {
    checkAuth,
    isLoggedIn: () => userStore.isLoggedIn(),
    logout,
  };
}
