import { api } from './api';
import { ResumeAnalysis } from '../types';

export const resumeService = {
  analyzeResume: async (data: {
    resumeText: string;
    fileName?: string;
    targetRole?: string;
    targetJobDescription?: string;
  }): Promise<{ success: boolean; analysis: ResumeAnalysis }> => {
    return api.post<{ success: boolean; analysis: ResumeAnalysis }>('/api/ai/resumes/analyze', data);
  },

  getHistory: async (): Promise<{ success: boolean; analyses: ResumeAnalysis[] }> => {
    return api.get<{ success: boolean; analyses: ResumeAnalysis[] }>('/api/ai/resumes/history');
  },
};
