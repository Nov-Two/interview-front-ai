import { computed, Ref } from 'vue';
import { useChatStore } from '@/store';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuth } from './useAuth';

export function useChat(sessionId: Ref<string>, messageText: Ref<string>) {
  const chatStore = useChatStore();
  const router = useRouter();
  const { locale } = useI18n();
  const { checkAuth } = useAuth();

  const currentSession = computed(() => {
    if (!sessionId.value) return null;
    return chatStore.sessions.find((s) => s.id === sessionId.value);
  });

  const ensureSession = () => {
    if (!currentSession.value) {
      const newSession = chatStore.createSession();
      sessionId.value = newSession.id;
      router.replace(`/chat/${newSession.id}`);
      return newSession.id;
    }
    return sessionId.value;
  };

  const sendMessage = () => {
    if (!messageText.value.trim()) return;
    if (!checkAuth()) return;

    const sid = ensureSession();

    chatStore.addMessage(sid, {
      role: 'user',
      content: messageText.value,
      type: 'text',
    });

    messageText.value = '';

    // Mock AI response
    setTimeout(() => {
      chatStore.addMessage(sid, {
        role: 'assistant',
        content:
          'This is a mock response from AI. ' +
          (locale.value === 'zh' ? '这是一个AI模拟回复。' : ''),
        type: 'text',
      });
    }, 1000);
  };

  const sendImage = (file: any) => {
    if (!checkAuth()) return;

    const sid = ensureSession();

    chatStore.addMessage(sid, {
      role: 'user',
      content: file.content || URL.createObjectURL(file.file),
      type: 'image',
    });

    setTimeout(() => {
      chatStore.addMessage(sid, {
        role: 'assistant',
        content: 'Nice image!',
        type: 'text',
      });
    }, 1000);
  };

  return {
    currentSession,
    sendMessage,
    sendImage,
  };
}
