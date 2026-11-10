import { api } from './api';
import { AIConversation, AIMessage } from '../types';

export interface ChatResponse {
  message: AIMessage;
  conversationId: string;
  source: 'claude' | 'fallback';
}

export const aiService = {
  async sendMessage(data: {
    message: string;
    conversationId?: string;
    skillLevel?: string;
    topicContext?: string;
  }): Promise<ChatResponse> {
    return api.post<ChatResponse>('/api/ai/chat', data);
  },

  async getConversations(): Promise<{ conversations: AIConversation[] }> {
    return api.get<{ conversations: AIConversation[] }>('/api/ai/conversations');
  },

  async getConversation(id: string): Promise<{ conversation: AIConversation }> {
    return api.get<{ conversation: AIConversation }>(`/api/ai/conversations/${id}`);
  },

  async deleteConversation(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/api/ai/conversations/${id}`);
  },
};
