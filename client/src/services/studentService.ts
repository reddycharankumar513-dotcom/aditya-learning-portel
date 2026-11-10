import { api } from './api';
import { User, Assessment } from '../types';

export const studentService = {
  getProfile: async (): Promise<{ success: boolean; profile: User }> => {
    return api.get<{ success: boolean; profile: User }>('/api/student/profile');
  },

  updateProfile: async (data: Partial<User>): Promise<{ success: boolean; profile: User; message: string }> => {
    return api.put<{ success: boolean; profile: User; message: string }>('/api/student/profile', data);
  },

  getAssessments: async (): Promise<{ success: boolean; assessments: Assessment[] }> => {
    return api.get<{ success: boolean; assessments: Assessment[] }>('/api/student/assessments');
  },

  submitAssessment: async (data: {
    title?: string;
    domain?: string;
    answers: Record<number, number>;
  }): Promise<{ success: boolean; assessment: Assessment }> => {
    return api.post<{ success: boolean; assessment: Assessment }>('/api/student/assessments', data);
  },
};
