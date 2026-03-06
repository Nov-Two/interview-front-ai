<template>
  <div class="h-screen w-full flex flex-col bg-[#f6f6f8] dark:bg-[#101622] transition-colors duration-300">
    
    <!-- Header -->
    <div class="flex-shrink-0 px-4 py-3 bg-[#f6f6f8cc] dark:bg-[#101622cc] backdrop-blur-md border-b border-[#e2e8f0] dark:border-[#1e293b] flex flex-col gap-4">
      <!-- Top Bar -->
      <div class="flex items-center justify-between h-11">
        <button @click="themeStore.toggleTheme" class="w-8 h-8 rounded-full flex items-center justify-center bg-transparent active:bg-gray-200 dark:active:bg-white/10 transition-colors">
           <van-icon :name="themeStore.isDark ? 'sunny-o' : 'moon-o'" size="20" class="text-gray-700 dark:text-gray-300" />
        </button>
        <span class="text-lg font-medium text-[#0f172a] dark:text-[#f1f5f9]">历史记录</span>
        <button class="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 rounded-full shadow-lg shadow-blue-500/30">
           <van-icon name="plus" size="16" class="text-white" @click="createNewChat" />
        </button>
      </div>

      <!-- Search Bar -->
      <div class="w-full h-10 bg-[#e2e8f0] dark:bg-[#1e293b80] rounded-xl flex items-center px-3 gap-2">
        <van-icon name="search" size="18" class="text-gray-400" />
        <input 
          v-model="searchText"
          type="text" 
          placeholder="搜索对话..." 
          class="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500"
        />
      </div>
    </div>

    <!-- Content (List) -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6">
      
      <!-- Group: Today -->
      <div v-if="groupedSessions.today.length > 0">
        <h3 class="text-xs font-medium text-gray-400 dark:text-[#94a3b8] uppercase tracking-wider mb-3 px-1">今天</h3>
        <div class="space-y-3">
          <div 
            v-for="session in groupedSessions.today" 
            :key="session.id"
            @click="goToChat(session.id)"
            class="group relative w-full bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-4 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all"
          >
            <div class="w-10 h-10 rounded-full bg-blue-50 dark:bg-[#135bec1a] flex items-center justify-center flex-shrink-0 text-blue-500 dark:text-blue-400">
              <van-icon name="chat-o" size="20" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9] truncate">{{ session.title }}</h4>
              <p class="text-xs text-gray-500 dark:text-[#94a3b8] mt-0.5 truncate">{{ formatDate(session.updatedAt) }} • {{ session.messages.length }} 条消息</p>
            </div>
            <van-icon name="arrow" class="text-gray-300 dark:text-gray-600" />
          </div>
        </div>
      </div>

      <!-- Group: Yesterday -->
      <div v-if="groupedSessions.yesterday.length > 0">
        <h3 class="text-xs font-medium text-gray-400 dark:text-[#94a3b8] uppercase tracking-wider mb-3 px-1">昨天</h3>
        <div class="space-y-3">
           <div 
            v-for="session in groupedSessions.yesterday" 
            :key="session.id"
            @click="goToChat(session.id)"
            class="group relative w-full bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-4 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all"
          >
            <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1e293b] flex items-center justify-center flex-shrink-0 text-gray-500 dark:text-gray-400">
              <van-icon name="chat-o" size="20" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9] truncate">{{ session.title }}</h4>
              <p class="text-xs text-gray-500 dark:text-[#94a3b8] mt-0.5 truncate">{{ formatDate(session.updatedAt) }} • {{ session.messages.length }} 条消息</p>
            </div>
            <van-icon name="arrow" class="text-gray-300 dark:text-gray-600" />
          </div>
        </div>
      </div>

      <!-- Group: Last 7 Days / Older -->
      <div v-if="groupedSessions.older.length > 0">
        <h3 class="text-xs font-medium text-gray-400 dark:text-[#94a3b8] uppercase tracking-wider mb-3 px-1">上周</h3>
        <div class="space-y-3">
           <div 
            v-for="session in groupedSessions.older" 
            :key="session.id"
            @click="goToChat(session.id)"
            class="group relative w-full bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-4 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all"
          >
            <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1e293b] flex items-center justify-center flex-shrink-0 text-gray-500 dark:text-gray-400">
              <van-icon name="chat-o" size="20" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-semibold text-gray-900 dark:text-[#f1f5f9] truncate">{{ session.title }}</h4>
              <p class="text-xs text-gray-500 dark:text-[#94a3b8] mt-0.5 truncate">{{ formatDate(session.updatedAt) }} • {{ session.messages.length }} 条消息</p>
            </div>
            <van-icon name="arrow" class="text-gray-300 dark:text-gray-600" />
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="allSessions.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
        <van-icon name="chat-o" size="48" class="mb-4 opacity-50" />
        <p class="text-sm">暂无历史记录</p>
      </div>

    </div>

    <!-- Bottom Navigation (As per screenshot 1_267) -->
    <div class="flex-shrink-0 h-[84px] bg-[#f6f6f8cc] dark:bg-[#0f172acc] backdrop-blur-md border-t border-[#e2e8f0] dark:border-[#1e293b] flex items-center justify-around px-6 pb-4">
      <div class="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
        <van-icon name="chat-o" size="24" class="text-gray-500 dark:text-[#94a3b8]" />
        <span class="text-[10px] font-medium text-gray-500 dark:text-[#94a3b8]">对话</span>
      </div>
      <div class="flex flex-col items-center gap-1 cursor-pointer">
        <van-icon name="clock-o" size="24" class="text-blue-600 dark:text-[#135bec]" />
        <span class="text-[10px] font-medium text-blue-600 dark:text-[#135bec]">历史</span>
      </div>
      <div class="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
        <van-icon name="compass-o" size="24" class="text-gray-500 dark:text-[#94a3b8]" />
        <span class="text-[10px] font-medium text-gray-500 dark:text-[#94a3b8]">探索</span>
      </div>
      <div class="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
        <van-icon name="user-o" size="24" class="text-gray-500 dark:text-[#94a3b8]" />
        <span class="text-[10px] font-medium text-gray-500 dark:text-[#94a3b8]">个人中心</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useChatStore, useUserStore, useThemeStore } from '@/store';
import { aiApi } from '@/api/ai';
import dayjs from 'dayjs';

const router = useRouter();
const chatStore = useChatStore();
const userStore = useUserStore();
const themeStore = useThemeStore();
const searchText = ref('');

// Helper to check dates
const isToday = (date: number) => dayjs(date).isSame(dayjs(), 'day');
const isYesterday = (date: number) => dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day');

onMounted(async () => {
  if (userStore.isLoggedIn()) {
    try {
      const history = await aiApi.getHistory();
      if (Array.isArray(history) && history.length > 0) {
        // Sync history logic (simplified)
        // ... (Keep existing logic or improve)
      }
    } catch (e) {
      console.error(e);
    }
  }
});

const allSessions = computed(() => {
  let sessions = chatStore.sessions;
  if (searchText.value) {
    const lower = searchText.value.toLowerCase();
    sessions = sessions.filter(s => s.title.toLowerCase().includes(lower));
  }
  // Sort by date desc
  return sessions.slice().sort((a, b) => b.updatedAt - a.updatedAt);
});

const groupedSessions = computed(() => {
  const today: any[] = [];
  const yesterday: any[] = [];
  const older: any[] = [];

  allSessions.value.forEach(session => {
    if (isToday(session.updatedAt)) {
      today.push(session);
    } else if (isYesterday(session.updatedAt)) {
      yesterday.push(session);
    } else {
      older.push(session);
    }
  });

  return { today, yesterday, older };
});

const createNewChat = () => {
  const newSession = chatStore.createSession('新对话', 'default');
  router.push(`/chat/${newSession.id}`);
};

const goToChat = (id: string) => {
  router.push(`/chat/${id}`);
};

const formatDate = (timestamp: number) => {
  return dayjs(timestamp).format('HH:mm');
};
</script>

<style scoped>
/* No extra styles needed, Tailwind does it all */
</style>
