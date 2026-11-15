import { api } from './api';
import { User, Assessment } from '../types';

export const studentService = {
  getProfile: async (): Promise<{ success: boolean; profile: User }> => {
    return api.get<{ success: boolean; profile: User }>('/api/student/profile');
  },

  updateProfile: async (data: Partial<User>): Promise<{ success: boolean; profile: User; message: string }> => {
    return api.put<{ success: boolean; profile: User; message: string }>('/api/student/profile', data);
  },

  generateAssessment: async (params: {
    role: string;
    skill: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    questionCount?: number;
    durationMinutes?: number;
  }): Promise<{ success: boolean; message: string; assessment: Assessment }> => {
    return api.post<{ success: boolean; message: string; assessment: Assessment }>(
      '/api/assessments/generate',
      params
    );
  },

  getAssessments: async (): Promise<{ success: boolean; assessments: Assessment[] }> => {
    return api.get<{ success: boolean; assessments: Assessment[] }>('/api/assessments');
  },

  getAssessmentById: async (id: string): Promise<{ success: boolean; assessment: Assessment }> => {
    return api.get<{ success: boolean; assessment: Assessment }>(`/api/assessments/${id}`);
  },

  startAssessment: async (id: string): Promise<{ success: boolean; assessment: Assessment }> => {
    return api.post<{ success: boolean; assessment: Assessment }>(`/api/assessments/${id}/start`, {});
  },

  submitAssessment: async (
    id: string,
    answers: Record<number, any>
  ): Promise<{ success: boolean; message: string; assessment: Assessment }> => {
    return api.post<{ success: boolean; message: string; assessment: Assessment }>(
      `/api/assessments/${id}/submit`,
      { answers }
    );
  },

  // Legacy fallback support
  submitLegacyAssessment: async (data: {
    title?: string;
    domain?: string;
    answers: Record<number, number>;
  }): Promise<{ success: boolean; assessment: Assessment }> => {
    return api.post<{ success: boolean; assessment: Assessment }>('/api/student/assessments', data);
  },
};
