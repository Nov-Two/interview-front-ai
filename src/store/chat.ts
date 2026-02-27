import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'image';
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  groupId?: string; // For grouping
  type: 'chat' | 'folder'; // New field to distinguish folders
  parentId?: string; // If inside a folder
  createdAt: number;
}

export interface ChatGroup {
  id: string;
  name: string;
}

export const useChatStore = defineStore('chat', () => {
  const sessions = ref<ChatSession[]>([]);
  const currentSessionId = ref<string | null>(null);
  const groups = ref<ChatGroup[]>([
    { id: 'default', name: 'General' },
    { id: 'work', name: 'Work' },
  ]);

  const createSession = (title = 'New Chat', groupId = 'default') => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title,
      messages: [],
      groupId,
      type: 'chat',
      createdAt: Date.now(),
    };
    sessions.value.unshift(newSession);
    currentSessionId.value = newSession.id;
    return newSession;
  };

  const deleteSession = (id: string) => {
    const index = sessions.value.findIndex((s) => s.id === id);
    if (index !== -1) {
      // If it's a folder, we might want to delete children or move them out.
      // For simplicity, let's delete children too.
      const session = sessions.value[index];
      if (session.type === 'folder') {
        const children = sessions.value.filter(s => s.parentId === id);
        children.forEach(c => deleteSession(c.id));
      }
      
      sessions.value.splice(index, 1);
      if (currentSessionId.value === id) {
        currentSessionId.value = sessions.value[0]?.id || null;
      }
    }
  };

  const addMessage = (sessionId: string, message: Omit<Message, 'id' | 'timestamp'> & { id?: string }) => {
    const session = sessions.value.find((s) => s.id === sessionId);
    if (session) {
      session.messages.push({
        ...message,
        id: message.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      });
      // Update title if it's the first user message
      if (session.messages.length === 1 && message.role === 'user' && message.type === 'text') {
        session.title = message.content.substring(0, 20) + (message.content.length > 20 ? '...' : '');
      }
    }
  };

  const mergeSessions = (ids: string[], folderName = 'Merged Chat') => {
    if (ids.length < 2) return;
    
    // Filter out folders, only allow merging chats
    const validIds = ids.filter(id => {
      const session = sessions.value.find(s => s.id === id);
      return session && session.type === 'chat';
    });

    if (validIds.length < 2) return;

    // Create a new folder session
    const folderSession: ChatSession = {
      id: Date.now().toString(),
      title: folderName,
      messages: [], // Folder doesn't have messages
      groupId: sessions.value.find(s => s.id === validIds[0])?.groupId || 'default',
      type: 'folder',
      createdAt: Date.now(),
    };
    
    sessions.value.unshift(folderSession);

    // Move selected sessions into the folder
    validIds.forEach(id => {
      const session = sessions.value.find(s => s.id === id);
      if (session) {
        session.parentId = folderSession.id;
      }
    });
  };

  const renameSession = (id: string, newTitle: string) => {
    const session = sessions.value.find(s => s.id === id);
    if (session) {
      session.title = newTitle;
    }
  };

  return {
    sessions,
    currentSessionId,
    groups,
    createSession,
    deleteSession,
    addMessage,
    mergeSessions,
    renameSession,
  };
});
