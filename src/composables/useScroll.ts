import { ref, nextTick, onMounted, watch } from 'vue';

export function useScrollToBottom(containerRef: any, dependency: any) {
  const scrollToBottom = () => {
    nextTick(() => {
      if (containerRef.value) {
        containerRef.value.scrollTop = containerRef.value.scrollHeight;
      }
    });
  };

  onMounted(() => {
    scrollToBottom();
  });

  watch(dependency, () => {
    scrollToBottom();
  }, { deep: true }); // Ensure deep watch if dependency is an array/object property

  return {
    scrollToBottom,
  };
}
