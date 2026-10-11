import { api } from './api';
import { Internship, InternshipApplication } from '../types';

export const internshipService = {
  async getInternships(): Promise<{ internships: Internship[] }> {
    return api.get<{ internships: Internship[] }>('/api/internships');
  },

  async apply(internshipId: string, data: { resumeUrl?: string; notes?: string }): Promise<{ message: string; application: InternshipApplication }> {
    return api.post<{ message: string; application: InternshipApplication }>(`/api/internships/${internshipId}/apply`, data);
  },

  async getMyApplications(): Promise<{ applications: InternshipApplication[] }> {
    return api.get<{ applications: InternshipApplication[] }>('/api/internships/my-applications');
  },
};
