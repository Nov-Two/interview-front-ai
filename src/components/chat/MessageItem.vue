<template>
  <div class="flex gap-3 max-w-[100%]" :class="msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'">
    <div class="flex-shrink-0">
      <van-image
        round
        width="36px"
        height="36px"
        class="shadow-sm border border-gray-100 dark:border-gray-700"
        :src="msg.role === 'user' ? 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg' : 'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png'"
      />
    </div>
    <div class="flex flex-col">
      <div 
        v-if="msg.type === 'text'" 
        :class="[
          'px-3 py-2 rounded-2xl text-[14px] leading-relaxed shadow-sm break-all transition-colors',
          msg.role === 'user' 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
        ]"
      >
        {{ msg.content }}
      </div>
      <div v-else class="overflow-hidden rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-1">
        <van-image :src="msg.content" width="140" class="rounded-lg" />
      </div>
      <div :class="['text-[10px] mt-1 text-gray-400 dark:text-gray-500', msg.role === 'user' ? 'text-right pr-1' : 'text-left pl-1']">
        {{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Message } from '@/store/chat';

defineProps({
  msg: {
    type: Object as PropType<Message>,
    required: true,
  },
});
</script>
