<template>
  <div class="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <ChatNavBar 
      :title="currentSession?.title || $t('common.newChat')" 
      :show-back="!!sessionId" 
      @back="onClickLeft" 
    />
    
    <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scroll-smooth" ref="messagesContainer">
      <div v-if="!currentSession || currentSession.messages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
        <div class="bg-blue-50 dark:bg-gray-800 p-6 rounded-full mb-4">
          <van-icon name="chat-o" size="48" class="text-blue-400 dark:text-blue-500" />
        </div>
        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Chat AI</h3>
        <p class="text-sm">{{ $t('common.typeMessage') }}</p>
      </div>
      
      <div v-else v-for="msg in currentSession?.messages" :key="msg.id">
        <MessageItem :msg="msg" />
      </div>
    </div>

    <ChatInput 
      v-model="messageText" 
      @send="sendMessage" 
      @image="sendImage" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore, useChatStore } from '@/store';
import { showToast } from 'vant';
import { useChat } from '@/composables/useChatLogic';
import { useScrollToBottom } from '@/composables/useScroll';
import ChatNavBar from '@/components/chat/ChatNavBar.vue';
import MessageItem from '@/components/chat/MessageItem.vue';
import ChatInput from '@/components/chat/ChatInput.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const chatStore = useChatStore();

const messageText = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
const sessionId = ref(route.params.id as string || '');

const { currentSession, sendMessage, sendImage } = useChat(sessionId, messageText);
const { scrollToBottom } = useScrollToBottom(
  messagesContainer, 
  () => currentSession.value?.messages.length
);

onMounted(() => {
  if (sessionId.value && !currentSession.value) {
    showToast('Chat not found');
    router.replace('/');
  }
});

const onClickLeft = () => {
  if (currentSession.value && currentSession.value.messages.length === 0) {
    chatStore.deleteSession(sessionId.value);
  }

  if (userStore.isLoggedIn()) {
    router.push('/list');
  } else if (sessionId.value) {
    router.push('/');
  }
};
</script>
