import { api } from './api';

export interface OpportunityItem {
  _id: string;
  title: string;
  company: string;
  category: 'Internship' | 'Full-time' | 'Graduate Program' | 'Entry-level';
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  location: string;
  experienceLevel: string;
  description: string;
  requiredSkills: string[];
  compensation: string;
  isVerified: boolean;
  matchScore: number;
  matchReason?: string;
  createdAt: string;
}

export interface ApplicationItem {
  _id: string;
  opportunity: OpportunityItem;
  status: 'saved' | 'applied' | 'assessment' | 'interview' | 'shortlisted' | 'offered' | 'rejected' | 'withdrawn';
  notes?: string;
  interviewDate?: string;
  matchScore: number;
  matchReason?: string;
  appliedAt?: string;
  updatedAt: string;
}

export const careerHubService = {
  getOpportunities: async (params: {
    category?: string;
    workMode?: string;
    search?: string;
  } = {}): Promise<{ success: boolean; opportunities: OpportunityItem[] }> => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.workMode) query.append('workMode', params.workMode);
    if (params.search) query.append('search', params.search);

    return api.get(`/api/career-hub/opportunities?${query.toString()}`);
  },

  applyToOpportunity: async (
    opportunityId: string,
    notes?: string
  ): Promise<{ success: boolean; message: string; application: ApplicationItem }> => {
    return api.post('/api/career-hub/applications/apply', { opportunityId, notes });
  },

  getMyApplications: async (): Promise<{ success: boolean; applications: ApplicationItem[] }> => {
    return api.get('/api/career-hub/applications/my');
  },

  updateApplicationStage: async (data: {
    applicationId: string;
    status?: string;
    notes?: string;
    interviewDate?: string;
  }): Promise<{ success: boolean; message: string; application: ApplicationItem }> => {
    return api.patch('/api/career-hub/applications/stage', data);
  },
};
