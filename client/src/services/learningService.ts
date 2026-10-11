import { api } from './api';
import { Recommendation, StudentProject } from '../types';

export interface DashboardStats {
  enrolledCount: number;
  inProgressCount: number;
  completedCount: number;
  learningHoursEstimate: number;
  projectsCount: number;
}

export const learningService = {
  async getDashboard(): Promise<{
    stats: DashboardStats;
    recentEnrollments: any[];
    recommendations: Recommendation[];
    projects: StudentProject[];
  }> {
    return api.get('/api/learning/dashboard');
  },

  async getRecommendations(): Promise<{ recommendations: Recommendation[] }> {
    return api.get<{ recommendations: Recommendation[] }>('/api/learning/recommendations');
  },

  async getProjects(): Promise<{ projects: StudentProject[] }> {
    return api.get<{ projects: StudentProject[] }>('/api/learning/projects');
  },

  async addProject(project: Omit<StudentProject, '_id'>): Promise<{ project: StudentProject }> {
    return api.post<{ project: StudentProject }>('/api/learning/projects', project);
  },

  async deleteProject(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/api/learning/projects/${id}`);
  },
};
