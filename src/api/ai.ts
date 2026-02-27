import request from './request';

export interface ChatDto {
  message: string;
  image?: string; // Base64 string
}

export interface ChatResponse {
  response: string;
}

export const aiApi = {
  chat(data: ChatDto, signal?: AbortSignal) {
    return request.post<ChatResponse>('/ai/chat', data, { signal });
  },
  
  getHistory() {
    return request.get<any[]>('/ai/history');
  },
};
