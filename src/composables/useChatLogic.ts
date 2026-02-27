import { computed, Ref, ref } from 'vue';
import { useChatStore } from '@/store';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuth } from './useAuth';
import { aiApi } from '@/api/ai';

export function useChat(sessionId: Ref<string>, messageText: Ref<string>) {
  const chatStore = useChatStore();
  const router = useRouter();
  const { locale } = useI18n();
  const { checkAuth } = useAuth();
  
  const isGenerating = ref(false);
  let abortController: AbortController | null = null;
  let streamInterval: any = null;

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
  
  const stopGeneration = () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    if (streamInterval) {
      clearInterval(streamInterval);
      streamInterval = null;
    }
    isGenerating.value = false;
  };

  const sendMessage = async (imageFile?: File | null) => {
    const text = messageText.value.trim();
    if (!text && !imageFile) return;
    if (!checkAuth()) return;
    
    // Stop previous generation if any
    stopGeneration();

    const sid = ensureSession();

    let imageContent = '';
    if (imageFile) {
      // Convert image to base64
      imageContent = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(imageFile);
      });
      
      chatStore.addMessage(sid, {
        role: 'user',
        content: imageContent,
        type: 'image',
      });
    }

    if (text) {
      chatStore.addMessage(sid, {
        role: 'user',
        content: text,
        type: 'text',
      });
    }

    messageText.value = '';
    isGenerating.value = true;
    abortController = new AbortController();

    // Create a temporary placeholder message
    const tempMsgId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    chatStore.addMessage(sid, {
      role: 'assistant',
      content: '...', // Loading indicator
      type: 'text',
      id: tempMsgId // We need to be able to find this message later
    } as any);

    try {
      const payload: any = { message: text || 'Analyze this image' };
      if (imageContent) {
        payload.image = imageContent;
      }
      
      const res = await aiApi.chat(payload, abortController.signal);
      
      if (!isGenerating.value) return; // If stopped during request

      // Handle response structure
      let content = '';
      if (typeof res === 'string') {
        try {
           const parsed = JSON.parse(res);
           content = parsed.reply || parsed.response || parsed.content || parsed.message || res;
        } catch (e) {
           content = res;
        }
      } else if (res && typeof res === 'object') {
        // Try common fields
        content = (res as any).reply || (res as any).response || (res as any).content || (res as any).message || JSON.stringify(res);
      } else {
        content = String(res);
      }

      // Find the message in the store and update it
      const session = chatStore.sessions.find(s => s.id === sid);
      if (session) {
        const lastMsg = session.messages[session.messages.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          // Streaming effect
          lastMsg.content = ''; // Clear loading indicator
          let i = 0;
          streamInterval = setInterval(() => {
            if (!isGenerating.value) {
              clearInterval(streamInterval);
              return;
            }
            if (i < content.length) {
              lastMsg.content += content.charAt(i);
              i++;
            } else {
              clearInterval(streamInterval);
              isGenerating.value = false;
            }
          }, 30); // 30ms per char
        }
      }

    } catch (error: any) {
      if (error.name === 'AbortError' || error.message === 'canceled') {
         // User stopped manually, do nothing or show stopped message
         isGenerating.value = false;
         return;
      }
      
      const session = chatStore.sessions.find(s => s.id === sid);
      if (session) {
        const lastMsg = session.messages[session.messages.length - 1];
         if (lastMsg && lastMsg.role === 'assistant') {
           lastMsg.content = locale.value === 'zh' ? '获取 AI 回复失败，请重试。' : 'Failed to get AI response. Please try again.';
         }
      }
      isGenerating.value = false;
    }
  };

  const sendImage = (file: any) => {
     // This method is now used just to select image for preview in ChatDetail, 
     // or we can delegate the actual sending to sendMessage.
     // But based on ChatInput logic, 'image' emit passes the file.
     // Let's assume ChatDetail handles the state.
  };

  return {
    currentSession,
    sendMessage,
    sendImage,
    isGenerating,
    stopGeneration
  };
}
