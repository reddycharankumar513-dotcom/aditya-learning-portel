import { api } from './api';
import { Resume, ResumeAnalysis } from '../types';

export const resumeService = {
  /**
   * Upload resume file (PDF/DOCX) or send raw text
   */
  uploadResume: async (formData: FormData): Promise<{ success: boolean; resume: Resume; analysis: ResumeAnalysis }> => {
    const token = localStorage.getItem('aditya_auth_token');
    const response = await fetch('/api/resumes/upload', {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Failed to upload resume' }));
      throw new Error(err.message || 'Failed to upload resume');
    }

    return response.json();
  },

  /**
   * Text-based analysis fallback
   */
  analyzeResume: async (data: {
    resumeText: string;
    fileName?: string;
    targetRole?: string;
    targetJobDescription?: string;
  }): Promise<{ success: boolean; analysis: ResumeAnalysis; resume?: Resume }> => {
    return api.post<{ success: boolean; analysis: ResumeAnalysis; resume?: Resume }>(
      '/api/resumes/upload',
      data
    );
  },

  getResumes: async (): Promise<{ success: boolean; resumes: Resume[] }> => {
    return api.get<{ success: boolean; resumes: Resume[] }>('/api/resumes');
  },

  getResumeById: async (id: string): Promise<{ success: boolean; resume: Resume }> => {
    return api.get<{ success: boolean; resume: Resume }>(`/api/resumes/${id}`);
  },

  matchJob: async (id: string, jobDescription: string): Promise<{ success: boolean; match: any }> => {
    return api.post<{ success: boolean; match: any }>(`/api/resumes/${id}/match-job`, { jobDescription });
  },

  improveResume: async (id: string): Promise<{ success: boolean; improvements: any }> => {
    return api.post<{ success: boolean; improvements: any }>(`/api/resumes/${id}/improve`, {});
  },

  updateSections: async (
    id: string,
    data: {
      summary?: string;
      projects?: Array<{ title: string; bullets: string[] }>;
      skills?: string[];
      acceptedSuggestion?: string;
    }
  ): Promise<{ success: boolean; resume: Resume }> => {
    return api.put<{ success: boolean; resume: Resume }>(`/api/resumes/${id}/sections`, data);
  },

  exportResume: async (id: string): Promise<{ success: boolean; fileName: string; contentMarkdown: string }> => {
    return api.get<{ success: boolean; fileName: string; contentMarkdown: string }>(`/api/resumes/${id}/export`);
  },

  getHistory: async (): Promise<{ success: boolean; analyses: ResumeAnalysis[] }> => {
    return api.get<{ success: boolean; analyses: ResumeAnalysis[] }>('/api/resumes/history');
  },
};
