<template>
  <van-swipe-cell 
    class="rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-800"
  >
    <van-cell
      center
      :is-link="!isMergeMode"
      class="!py-3 !px-3 !bg-transparent dark:!text-gray-200 transition-colors duration-200"
      :class="{ '!bg-blue-50 dark:!bg-blue-900/20': selected }"
      @click="$emit('click')"
    >
      <template #title>
        <div class="flex items-center gap-2">
          <van-tag v-if="session.type === 'folder'" type="warning" plain>{{ $t('common.folder') }}</van-tag>
          <van-tag v-else type="primary" plain>{{ $t('common.chat') }}</van-tag>
          <span class="font-medium text-gray-900 dark:text-gray-100 truncate">{{ session.title || $t('common.newChat') }}</span>
        </div>
      </template>
      <template #label>
        <span class="text-gray-500 dark:text-gray-400 truncate block mt-1">
          {{ session.messages.length > 0 ? session.messages[session.messages.length - 1].content : $t('common.noMessages') }}
        </span>
      </template>
      <template #icon>
          <div class="mr-3 flex items-center justify-center">
            <van-checkbox v-if="isMergeMode && session.type !== 'folder'" :name="session.id" @click.stop class="mr-3" />
            <div v-else-if="isMergeMode" class="mr-3 w-5 h-5 flex items-center justify-center">
              <van-icon name="prohibit" class="text-gray-300" />
            </div>
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400" :class="session.type === 'folder' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-blue-100 dark:bg-blue-900/30'">
              <van-icon :name="session.type === 'folder' ? 'folder-o' : 'chat-o'" size="20" />
            </div>
          </div>
      </template>
    </van-cell>
    <template #right>
      <div class="h-full flex">
        <van-button square type="primary" :text="$t('common.rename')" class="!h-full" @click="$emit('rename')" />
        <van-button square type="danger" :text="$t('common.delete')" class="!h-full" @click="$emit('delete')" />
      </div>
    </template>
  </van-swipe-cell>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ChatSession } from '@/store/chat';

defineProps({
  session: {
    type: Object as PropType<ChatSession>,
    required: true,
  },
  isMergeMode: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['click', 'delete', 'rename']);
</script>
