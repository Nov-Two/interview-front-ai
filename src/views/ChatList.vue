<template>
  <div class="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <van-nav-bar
      :title="currentFolder ? currentFolder.title : $t('common.chats')"
      :right-text="!isMergeMode && !currentFolder ? $t('common.newChat') : ''"
      @click-right="createNewChat"
      class="!bg-white dark:!bg-gray-800 !shadow-sm !border-b-0 dark:!text-white"
    >
      <template #left>
        <button 
          v-if="currentFolder"
          @click="exitFolder"
          class="text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center"
        >
          <van-icon name="arrow-left" class="mr-1" /> {{ $t('common.back') }}
        </button>
        <button 
          v-else-if="!isMergeMode"
          @click="router.push('/')"
          class="text-blue-600 dark:text-blue-400 font-medium text-sm"
        >
          {{ $t('common.back') }}
        </button>
      </template>
    </van-nav-bar>
    
    <div class="flex-1 flex flex-col dark:text-gray-200 h-[calc(100vh-100px)] overflow-y-auto">
      <van-checkbox-group v-model="selectedSessions">
        <div class="space-y-1 p-2">
          <ChatListItem
            v-for="session in filteredSessions"
            :key="session.id"
            :session="session"
            :is-merge-mode="isMergeMode"
            :selected="selectedSessions.includes(session.id)"
            @click="goToChat(session.id)"
            @delete="deleteChat(session.id)"
            @rename="openRenameDialog(session.id, session.title)"
          />
        </div>
      </van-checkbox-group>
      
      <div v-if="filteredSessions.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        <van-empty :description="$t('common.emptyGroup')" />
      </div>
    </div>

    <!-- Floating Action Button -->
    <div class="fixed bottom-8 right-6 z-50" v-if="!isMergeMode && filteredSessions.length > 0">
       <button 
         @click="toggleMergeMode"
         class="w-14 h-14 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all mb-4 border border-gray-100 dark:border-gray-700"
       >
         <van-icon name="apps-o" size="24" />
       </button>
       <button 
         @click="createNewChat"
         class="w-14 h-14 rounded-full bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 transition-all"
       >
         <van-icon name="plus" size="24" />
       </button>
    </div>

    <!-- Merge Bar -->
    <div 
      v-if="isMergeMode"
      class="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex gap-3 z-50 pb-safe transition-colors duration-300"
    >
      <button 
        @click="confirmMerge"
        class="flex-1 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
      >
        {{ $t('common.merge') }} ({{ selectedSessions.length }})
      </button>
      <button 
        @click="toggleMergeMode"
        class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all"
      >
        {{ $t('common.cancel') }}
      </button>
    </div>
    <van-dialog v-model:show="showMergeDialog" :title="$t('common.merge')" show-cancel-button @confirm="handleMergeConfirm">
      <div class="p-4">
        <van-field v-model="mergeFolderName" :placeholder="$t('common.folderName')" class="bg-gray-100 rounded-lg" />
      </div>
    </van-dialog>
    <van-dialog v-model:show="showRenameDialog" :title="$t('common.rename')" show-cancel-button @confirm="handleRenameConfirm">
      <div class="p-4">
        <van-field v-model="renameValue" :placeholder="$t('common.chatName')" class="bg-gray-100 rounded-lg" />
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useChatStore, useUserStore } from '@/store';
import { showConfirmDialog, showToast } from 'vant';
import { useI18n } from 'vue-i18n';
import ChatListItem from '@/components/chat/ChatListItem.vue';
import { aiApi } from '@/api/ai';

const router = useRouter();
const chatStore = useChatStore();
const userStore = useUserStore();
const { t } = useI18n();
const activeGroup = ref('default');
const isMergeMode = ref(false);
const selectedSessions = ref<string[]>([]);
const currentFolderId = ref<string | null>(null);
const showMergeDialog = ref(false);
const mergeFolderName = ref('');
const showRenameDialog = ref(false);
const renameValue = ref('');
const renameId = ref('');

onMounted(async () => {
  if (userStore.isLoggedIn()) {
    try {
      const history = await aiApi.getHistory();
      console.log('Chat history:', history);
      
      if (Array.isArray(history) && history.length > 0) {
        // Map history to chat sessions
        // Assuming history is an array of messages or sessions. 
        // Based on the screenshot, it seems to be a flat array of messages: {id, question, answer, ...}
        
        // We need to group these into sessions or create one big session for "History"
        // Let's create a session for each history item or group them.
        // For simplicity, let's create a "History" session if not exists, or populate sessions based on some ID.
        
        // Strategy: Create a session for each Q&A pair or group them.
        // Let's assume we want to show them as individual chats for now, or one big "History" chat.
        // Given the structure {id, question, answer}, let's create a session for each.
        
        history.forEach((item: any) => {
          // Check if session already exists (maybe using item.id as session id)
          const existingSession = chatStore.sessions.find(s => s.id === String(item.id));
          if (!existingSession) {
            const newSession = chatStore.createSession(item.question || 'History Chat', 'default');
             // Overwrite ID to match backend if needed, or keep local ID. 
             // If we want to persist backend ID:
             newSession.id = String(item.id); 
             // But createSession unshifts to array. Let's modify it.
             
             // Add User Question
             if (item.question) {
                chatStore.addMessage(newSession.id, {
                  role: 'user',
                  content: item.question,
                  type: 'text'
                });
             }
             
             // Add AI Answer
             if (item.answer) {
                chatStore.addMessage(newSession.id, {
                  role: 'assistant',
                  content: item.answer,
                  type: 'text'
                });
             }
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  }
});

const currentFolder = computed(() => {
  if (!currentFolderId.value) return null;
  return chatStore.sessions.find((s: any) => s.id === currentFolderId.value);
});

const filteredSessions = computed(() => {
  if (currentFolderId.value) {
    // If inside a folder, show its children
    return chatStore.sessions.filter((s: any) => s.parentId === currentFolderId.value);
  }
  // If at root, show sessions without parentId (ignore group)
  return chatStore.sessions.filter((s: any) => !s.parentId);
});

const createNewChat = () => {
  if (currentFolderId.value) return; // Cannot create chat inside folder for now
  const newSession = chatStore.createSession(t('common.newChat'), activeGroup.value);
  router.push(`/chat/${newSession.id}`);
};

const goToChat = (id: string) => {
  const session = chatStore.sessions.find((s: any) => s.id === id);
  
  if (isMergeMode.value) {
    // Only allow selecting 'chat' type for merge, or maybe both?
    // Let's assume we can only merge chats for now.
    if (session?.type === 'folder') return;
    
    const index = selectedSessions.value.indexOf(id);
    if (index === -1) {
      selectedSessions.value.push(id);
    } else {
      selectedSessions.value.splice(index, 1);
    }
    return;
  }

  if (session?.type === 'folder') {
    currentFolderId.value = id;
  } else {
    router.push(`/chat/${id}`);
  }
};

const exitFolder = () => {
  currentFolderId.value = null;
};

const deleteChat = (id: string) => {
  showConfirmDialog({
    title: t('common.deleteConfirmTitle'),
    message: t('common.deleteConfirmMessage'),
  })
    .then(() => {
      chatStore.deleteSession(id);
      showToast(t('common.deleted'));
    })
    .catch(() => {
      // on cancel
    });
};

const toggleMergeMode = () => {
  isMergeMode.value = !isMergeMode.value;
  selectedSessions.value = [];
};

const confirmMerge = () => {
  if (selectedSessions.value.length < 2) {
    showToast(t('common.mergeSelectError'));
    return;
  }
  mergeFolderName.value = '';
  showMergeDialog.value = true;
};

const handleMergeConfirm = () => {
  const name = mergeFolderName.value.trim() || t('common.mergedChat');
  chatStore.mergeSessions(selectedSessions.value, name);
  showToast(t('common.mergeSuccess'));
  isMergeMode.value = false;
  selectedSessions.value = [];
  showMergeDialog.value = false;
};

const openRenameDialog = (id: string, currentTitle: string) => {
  renameId.value = id;
  renameValue.value = currentTitle;
  showRenameDialog.value = true;
};

const handleRenameConfirm = () => {
  if (renameValue.value.trim()) {
    chatStore.renameSession(renameId.value, renameValue.value.trim());
    showToast(t('common.renameSuccess') || 'Renamed successfully');
  }
  showRenameDialog.value = false;
};
</script>

<style scoped>
/* Tailwind handles mostly everything */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
:deep(.van-tabs__nav) {
  background: transparent;
}
.dark :deep(.van-tab) {
  color: #9ca3af;
}
.dark :deep(.van-tab--active) {
  color: #e5e7eb;
}
</style>
