<template>
  <div class="h-screen w-full flex flex-col bg-[#f6f6f8] dark:bg-[#101622] transition-colors duration-300">
    
    <!-- Header -->
    <div class="flex-shrink-0 px-4 h-16 flex items-center justify-between bg-[#f6f6f8cc] dark:bg-[#101622cc] backdrop-blur-md border-b border-[#e2e8f0] dark:border-[#1e293b] z-20">
      <button @click="router.push('/list')" class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
        <van-icon name="apps-o" size="20" class="text-gray-700 dark:text-gray-300" />
      </button>
      
      <div class="flex flex-col items-center">
        <span class="text-base font-semibold text-gray-900 dark:text-white">Nexus AI</span>
        <div class="flex items-center gap-1">
          <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span class="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">GPT-4o</span>
        </div>
      </div>

      <button class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
        <van-icon name="ellipsis" size="20" class="text-gray-700 dark:text-gray-300" />
      </button>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-6" ref="messagesContainer">
      
      <!-- Welcome Empty State -->
      <div v-if="!currentSession || currentSession.messages.length === 0" class="flex-1 flex flex-col items-center justify-center pb-20">
        <div class="w-16 h-16 rounded-full bg-white dark:bg-[#1e293b] shadow-lg flex items-center justify-center mb-6">
          <van-icon name="smile-o" size="32" class="text-blue-500" />
        </div>
        <h2 class="text-2xl font-medium text-gray-900 dark:text-white mb-2">欢迎回来！</h2>
        <p class="text-center text-gray-500 dark:text-gray-400 max-w-[280px] leading-relaxed">
          我已经准备好协助您的创意项目、编程任务，或回答您今天的任何疑问。
        </p>

        <!-- Suggestions -->
        <div class="mt-10 w-full max-w-md space-y-3">
           <button @click="setPrompt('为移动应用设计未来感 UI')" class="w-full p-4 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#1e293b] rounded-xl flex items-center gap-3 text-left hover:bg-gray-50 dark:hover:bg-[#2c3e50] transition-colors">
             <van-icon name="photograph" class="text-blue-500" />
             <span class="text-sm text-gray-700 dark:text-gray-200">为移动应用设计未来感 UI</span>
           </button>
           <button @click="setPrompt('解释量子计算原理')" class="w-full p-4 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#1e293b] rounded-xl flex items-center gap-3 text-left hover:bg-gray-50 dark:hover:bg-[#2c3e50] transition-colors">
             <van-icon name="bulb-o" class="text-orange-500" />
             <span class="text-sm text-gray-700 dark:text-gray-200">解释量子计算原理</span>
           </button>
        </div>
      </div>

      <!-- Messages -->
      <div v-else v-for="msg in currentSession?.messages" :key="msg.id" class="flex flex-col gap-2">
        
        <!-- User Message -->
        <div v-if="msg.role === 'user'" class="flex justify-end">
          <div class="max-w-[85%]">
            <!-- User Bubble -->
            <div class="bg-[#007aff] text-white px-5 py-3 rounded-[20px] rounded-tr-sm shadow-md text-[15px] leading-relaxed">
              {{ msg.content }}
            </div>
          </div>
        </div>

        <!-- Assistant Message -->
        <div v-else class="flex justify-start gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <van-icon name="chat-o" size="16" color="white" />
          </div>
          <div class="max-w-[85%]">
            <div class="bg-white dark:bg-[#1e293b] text-gray-800 dark:text-gray-100 px-5 py-4 rounded-[20px] rounded-tl-sm shadow-sm border border-gray-100 dark:border-[#1e293b] text-[15px] leading-relaxed">
              <div v-if="msg.content" class="whitespace-pre-wrap">{{ msg.content }}</div>
              <div v-else class="flex gap-1 items-center h-6">
                <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
            <!-- Actions -->
             <!-- <div class="flex gap-2 mt-2 ml-1">
               <button class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><van-icon name="good-job-o" /></button>
               <button class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><van-icon name="replay" /></button>
             </div> -->
          </div>
        </div>

      </div>
    </div>

    <!-- Input Area -->
    <div class="flex-shrink-0 p-4 bg-[#f6f6f8] dark:bg-[#101622]">
      <div class="relative w-full max-w-2xl mx-auto">
        <!-- Input Container -->
        <div class="w-full bg-white dark:bg-[#1e293b] rounded-[24px] shadow-lg border border-gray-200 dark:border-[#1e293b] overflow-hidden transition-all focus-within:ring-2 ring-blue-500/20">
          
          <!-- Image Preview -->
          <div v-if="selectedImagePreview" class="px-4 pt-4 pb-0">
             <div class="relative inline-block">
               <img :src="selectedImagePreview" class="h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-600" />
               <button @click="clearImage" class="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 shadow-md hover:bg-black">
                 <van-icon name="cross" size="12" />
               </button>
             </div>
          </div>

          <div class="flex items-end p-2 gap-2">
            <!-- Attachment Button -->
            <button class="p-3 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2c3e50] transition-colors relative">
               <van-icon name="plus" size="20" />
               <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" @change="onSelectImage" />
            </button>
            
            <!-- Textarea -->
            <textarea 
              v-model="messageText"
              rows="1"
              placeholder="发送消息..."
              class="flex-1 max-h-32 py-3 bg-transparent border-none outline-none text-base text-gray-900 dark:text-white resize-none"
              style="min-height: 44px;"
              @keydown.enter.prevent="onSend"
            ></textarea>

            <!-- Send Button -->
            <button 
              @click="isGenerating ? stopGeneration() : onSend()"
              class="p-2 rounded-full transition-all duration-200"
              :class="messageText.trim() || isGenerating ? 'bg-[#007aff] text-white shadow-md' : 'bg-gray-100 dark:bg-[#2c3e50] text-gray-400'"
              :disabled="!messageText.trim() && !isGenerating"
            >
              <van-icon v-if="isGenerating" name="stop" size="20" />
              <van-icon v-else name="arrow-up" size="20" class="font-bold" />
            </button>
          </div>
        </div>
        
        <p class="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-3">
          Nexus AI 可能会犯错。请核查重要信息。
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChatStore, useUserStore } from '@/store';
import { useChat } from '@/composables/useChatLogic';
import { useScrollToBottom } from '@/composables/useScroll';

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();
const userStore = useUserStore();

const sessionId = ref(route.params.id as string || '');
const messageText = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
const selectedImageFile = ref<File | null>(null);
const selectedImagePreview = ref<string | null>(null);

const { currentSession, sendMessage: triggerSend, isGenerating, stopGeneration } = useChat(sessionId, messageText);
const { scrollToBottom } = useScrollToBottom(messagesContainer, () => currentSession.value?.messages.length);

onMounted(() => {
  if (!sessionId.value) {
    // If no ID, maybe create new one or just show empty state
  }
  scrollToBottom();
});

const setPrompt = (text: string) => {
  messageText.value = text;
  // Optional: Auto send
  // onSend();
};

const onSelectImage = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    selectedImageFile.value = file;
    selectedImagePreview.value = URL.createObjectURL(file);
  }
};

const clearImage = () => {
  selectedImageFile.value = null;
  selectedImagePreview.value = null;
};

const onSend = async () => {
  if (!messageText.value.trim() && !selectedImageFile.value) return;
  
  await triggerSend(selectedImageFile.value);
  clearImage();
  await nextTick();
  scrollToBottom();
};
</script>

<style scoped>
/* Tailwind handles styles */
</style>
