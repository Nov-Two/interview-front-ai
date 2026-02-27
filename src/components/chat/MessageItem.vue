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
    <div class="flex flex-col max-w-[80%]">
      <div 
        v-if="msg.type === 'text'" 
        :class="[
          'px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm break-words transition-colors',
          msg.role === 'user' 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
        ]"
      >
        <div v-if="msg.role === 'assistant'" class="markdown-body" v-html="renderedContent"></div>
        <div v-else>{{ msg.content }}</div>
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
import { PropType, computed } from 'vue';
import type { Message } from '@/store/chat';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
});

const props = defineProps({
  msg: {
    type: Object as PropType<Message>,
    required: true,
  },
});

const renderedContent = computed(() => {
  if (props.msg.role === 'assistant' && props.msg.type === 'text') {
    return md.render(props.msg.content || '');
  }
  return '';
});
</script>

<style scoped>
:deep(.markdown-body) {
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
}

:deep(.markdown-body p) {
  margin-bottom: 0.5em;
}
:deep(.markdown-body p:last-child) {
  margin-bottom: 0;
}
:deep(.markdown-body ul), :deep(.markdown-body ol) {
  padding-left: 1.2em;
  margin-bottom: 0.5em;
}
:deep(.markdown-body li) {
  list-style: disc;
}
:deep(.markdown-body ol li) {
  list-style: decimal;
}
:deep(.markdown-body pre) {
  background-color: #f3f4f6;
  padding: 0.8em;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 0.5em;
  font-family: monospace;
}
.dark :deep(.markdown-body pre) {
  background-color: #374151;
}
:deep(.markdown-body code) {
  font-family: monospace;
  background-color: #f3f4f6;
  padding: 0.1em 0.3em;
  border-radius: 4px;
  font-size: 0.9em;
}
.dark :deep(.markdown-body code) {
  background-color: #374151;
}
:deep(.markdown-body pre code) {
  background-color: transparent;
  padding: 0;
}
:deep(.markdown-body strong) {
  font-weight: 600;
}
</style>
