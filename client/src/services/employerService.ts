import { api } from './api';
import { OpportunityItem } from './careerHubService';

export interface CompanyProfile {
  _id: string;
  companyName: string;
  businessEmail: string;
  website: string;
  industry: string;
  description: string;
  recruiterName: string;
  designation: string;
  isVerified: boolean;
}

export interface CandidateProfile {
  _id: string;
  name: string;
  email: string;
  college: string;
  degree: string;
  department: string;
  graduationYear: number;
  skills: Array<{ name: string; proficiency: string; verified?: boolean }>;
  preferredRoles: string[];
  careerReadinessScore: number;
  readinessBreakdown: {
    skillsScore: number;
    interviewScore: number;
    resumeScore: number;
    projectsScore: number;
  };
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface PipelineItem {
  _id: string;
  opportunity: {
    _id: string;
    title: string;
    company: string;
    category: string;
    workMode: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
    college: string;
    degree: string;
    graduationYear: number;
    careerReadinessScore: number;
  };
  status: string;
  notes?: string;
  interviewDate?: string;
  updatedAt: string;
}

export const employerService = {
  getProfile: async (): Promise<{ success: boolean; company: CompanyProfile }> => {
    return api.get('/api/employers/profile');
  },

  updateProfile: async (data: Partial<CompanyProfile>): Promise<{ success: boolean; company: CompanyProfile; message: string }> => {
    return api.put('/api/employers/profile', data);
  },

  getDashboard: async (): Promise<{
    success: boolean;
    stats: {
      activeJobs: number;
      totalApplicants: number;
      pipelineCounts: Record<string, number>;
    };
    recentApplications: any[];
  }> => {
    return api.get('/api/employers/dashboard');
  },

  getJobs: async (): Promise<{ success: boolean; jobs: OpportunityItem[] }> => {
    return api.get('/api/employers/jobs');
  },

  createJob: async (data: {
    title: string;
    company?: string;
    category?: string;
    workMode?: string;
    location?: string;
    experienceLevel?: string;
    description: string;
    requiredSkills: string[];
    compensation?: string;
  }): Promise<{ success: boolean; opportunity: OpportunityItem; message: string }> => {
    return api.post('/api/employers/jobs', data);
  },

  discoverTalent: async (params: {
    skill?: string;
    role?: string;
    minScore?: number;
  } = {}): Promise<{ success: boolean; candidates: CandidateProfile[] }> => {
    const query = new URLSearchParams();
    if (params.skill) query.append('skill', params.skill);
    if (params.role) query.append('role', params.role);
    if (params.minScore) query.append('minScore', params.minScore.toString());

    return api.get(`/api/employers/talent?${query.toString()}`);
  },

  getPipeline: async (): Promise<{ success: boolean; pipeline: PipelineItem[] }> => {
    return api.get('/api/employers/pipeline');
  },

  updateCandidateStage: async (data: {
    applicationId: string;
    status: string;
    notes?: string;
    interviewDate?: string;
  }): Promise<{ success: boolean; message: string }> => {
    return api.patch('/api/employers/pipeline/stage', data);
  },
};
