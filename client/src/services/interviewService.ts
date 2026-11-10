import { api } from './api';
import { Interview } from '../types';

export interface CreateInterviewParams {
  role: string;
  experienceLevel: 'Fresher / Entry' | '1-2 Years' | '3+ Years';
  difficulty: 'Standard' | 'Challenging' | 'Expert';
  type: 'Technical' | 'HR' | 'Behavioral' | 'Coding' | 'Role-based' | 'Mixed';
  mode: 'Text' | 'Voice' | 'Video';
  jobDescription?: string;
  durationMinutes?: number;
}

export const interviewService = {
  createInterview: async (params: CreateInterviewParams): Promise<{ success: boolean; interview: Interview }> => {
    return api.post<{ success: boolean; interview: Interview }>('/api/ai/interviews', params);
  },

  getInterview: async (id: string): Promise<{ success: boolean; interview: Interview }> => {
    return api.get<{ success: boolean; interview: Interview }>(`/api/ai/interviews/${id}`);
  },

  submitAnswer: async (
    id: string,
    questionId: number,
    answer: string,
    timeSpentSeconds: number
  ): Promise<{ success: boolean; interview: Interview; currentQuestionIndex: number }> => {
    return api.post<{ success: boolean; interview: Interview; currentQuestionIndex: number }>(
      `/api/ai/interviews/${id}/answer`,
      { questionId, answer, timeSpentSeconds }
    );
  },

  completeInterview: async (id: string): Promise<{ success: boolean; interview: Interview; message: string }> => {
    return api.post<{ success: boolean; interview: Interview; message: string }>(
      `/api/ai/interviews/${id}/complete`
    );
  },

  getHistory: async (): Promise<{ success: boolean; interviews: Interview[] }> => {
    return api.get<{ success: boolean; interviews: Interview[] }>('/api/ai/interviews/history');
  },
};
