<template>
  <div class="flex flex-col bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] transition-colors duration-300">
    <!-- Image Preview -->
    <div v-if="selectedImage" class="px-4 py-2 flex items-center bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
       <div class="relative inline-block">
         <img :src="selectedImage" class="h-16 w-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" />
         <button 
           @click="clearImage"
           class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 transition-colors"
         >
           <van-icon name="cross" size="10" />
         </button>
       </div>
    </div>

    <div class="px-4 py-3 flex items-end">
      <van-uploader :after-read="onImageUpload" class="mr-3 mb-1.5" :disabled="disabled || !!selectedImage">
        <div class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer" :class="{'opacity-50': disabled || !!selectedImage}">
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
        @click="onAction" 
        :disabled="(!modelValue.trim() && !selectedImage && !isGenerating)"
        class="mb-1.5 p-2 rounded-full text-white shadow-md disabled:opacity-50 disabled:shadow-none disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-all active:scale-95 flex items-center justify-center w-9 h-9"
        :class="isGenerating ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'"
      >
        <van-icon v-if="isGenerating" name="stop" size="16" />
        <van-icon v-else name="guide-o" size="18" class="transform rotate-90" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
  selectedImage?: string | null;
  isGenerating?: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'send', 'stop', 'image', 'clear-image']);

const { t } = useI18n();

const onInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  target.style.height = 'auto';
  target.style.height = target.scrollHeight + 'px';
  emit('update:modelValue', target.value);
};

const onSend = () => {
  if ((props.modelValue.trim() || props.selectedImage) && !props.disabled) {
    emit('send');
  }
};

const onAction = () => {
  if (props.isGenerating) {
    emit('stop');
  } else {
    onSend();
  }
};

const onImageUpload = (file: any) => {
  if (!props.disabled) {
    emit('image', file);
  }
};

const clearImage = () => {
  emit('clear-image');
};
</script>
