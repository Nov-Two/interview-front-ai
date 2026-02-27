import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store';
import Login from '@/views/Login.vue';
import ChatList from '@/views/ChatList.vue';
import ChatDetail from '@/views/ChatDetail.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ChatDetail, // Default to chat page
    meta: { requiresAuth: false }, // Allow guest access for UI, check on action
  },
  {
    path: '/list',
    name: 'ChatList',
    component: ChatList,
    meta: { requiresAuth: true }, // List requires auth? Maybe.
  },
  {
    path: '/chat/:id',
    name: 'ChatDetail',
    component: ChatDetail,
    meta: { requiresAuth: false }, // Allow guest to see chat UI, check on action
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth && !userStore.isLoggedIn()) {
    next('/login');
  } else {
    next();
  }
});

export default router;
