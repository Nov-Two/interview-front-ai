<template>
  <div class="bg-white dark:bg-gray-800 px-4 py-3 flex items-end border-t border-gray-100 dark:border-gray-700 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] transition-colors duration-300">
    <van-uploader :after-read="onImageUpload" class="mr-3 mb-1.5">
      <div class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
        <van-icon name="photo-o" size="24" class="text-blue-500 dark:text-blue-400" />
      </div>
    </van-uploader>
    <div class="flex-1 bg-gray-50 dark:bg-gray-700 rounded-2xl px-4 py-2 mr-3 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900 focus-within:bg-white dark:focus-within:bg-gray-600 transition-all border border-transparent focus-within:border-blue-200 dark:focus-within:border-blue-700">
      <textarea
        :value="modelValue"
        rows="1"
        :placeholder="$t('common.typeMessage')"
        class="w-full bg-transparent border-none outline-none resize-none text-gray-700 dark:text-gray-200 text-sm max-h-32 py-0.5 placeholder-gray-400 dark:placeholder-gray-500"
        @keydown.enter.prevent="onSend"
        style="min-height: 20px;"
        @input="onInput"
      ></textarea>
    </div>
    <button 
      @click="onSend" 
      :disabled="!modelValue.trim()"
      class="mb-1.5 p-2 rounded-full bg-blue-600 dark:bg-blue-500 text-white shadow-md disabled:opacity-50 disabled:shadow-none disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-all hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-95 flex items-center justify-center w-9 h-9"
    >
      <van-icon name="guide-o" size="18" class="transform rotate-90" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue', 'send', 'image']);

const { t } = useI18n();

const onInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  target.style.height = 'auto';
  target.style.height = target.scrollHeight + 'px';
  emit('update:modelValue', target.value);
};

const onSend = () => {
  if (props.modelValue.trim()) {
    emit('send');
  }
};

const onImageUpload = (file: any) => {
  emit('image', file);
};
</script>
