import { api } from './api';
import { Course, Internship, InternshipApplication, ContactInquiry, User } from '../types';

export interface AdminMetrics {
  totalUsers: number;
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  totalApplications: number;
  totalInquiries: number;
}

export const adminService = {
  async getMetrics(): Promise<{ metrics: AdminMetrics }> {
    return api.get<{ metrics: AdminMetrics }>('/api/admin/metrics');
  },

  // Courses
  async getCourses(): Promise<{ courses: Course[] }> {
    return api.get<{ courses: Course[] }>('/api/admin/courses');
  },
  async createCourse(data: Partial<Course>): Promise<{ course: Course }> {
    return api.post<{ course: Course }>('/api/admin/courses', data);
  },
  async updateCourse(id: string, data: Partial<Course>): Promise<{ course: Course }> {
    return api.patch<{ course: Course }>(`/api/admin/courses/${id}`, data);
  },
  async deleteCourse(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/api/admin/courses/${id}`);
  },

  // Internships
  async getInternships(): Promise<{ internships: Internship[] }> {
    return api.get<{ internships: Internship[] }>('/api/admin/internships');
  },
  async createInternship(data: Partial<Internship>): Promise<{ internship: Internship }> {
    return api.post<{ internship: Internship }>('/api/admin/internships', data);
  },
  async updateInternship(id: string, data: Partial<Internship>): Promise<{ internship: Internship }> {
    return api.patch<{ internship: Internship }>(`/api/admin/internships/${id}`, data);
  },
  async deleteInternship(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/api/admin/internships/${id}`);
  },

  // Users
  async getUsers(): Promise<{ users: User[] }> {
    return api.get<{ users: User[] }>('/api/admin/users');
  },
  async updateUserRole(id: string, role: string): Promise<{ user: User }> {
    return api.patch<{ user: User }>(`/api/admin/users/${id}/role`, { role });
  },

  // Applications
  async getApplications(): Promise<{ applications: InternshipApplication[] }> {
    return api.get<{ applications: InternshipApplication[] }>('/api/admin/applications');
  },
  async updateApplicationStatus(id: string, status: string): Promise<{ application: InternshipApplication }> {
    return api.patch<{ application: InternshipApplication }>(`/api/admin/applications/${id}`, { status });
  },

  // Inquiries
  async getInquiries(): Promise<{ inquiries: ContactInquiry[] }> {
    return api.get<{ inquiries: ContactInquiry[] }>('/api/admin/inquiries');
  },
  async updateInquiryStatus(id: string, status: string): Promise<{ inquiry: ContactInquiry }> {
    return api.patch<{ inquiry: ContactInquiry }>(`/api/admin/inquiries/${id}`, { status });
  },

  // Platform Integrations & API Keys
  async getSettings(): Promise<{ settings: any }> {
    return api.get<{ settings: any }>('/api/admin/settings');
  },
  async updateSettings(data: { anthropicApiKey?: string; mongodbUri?: string }): Promise<{ message: string; settings: any }> {
    return api.patch<{ message: string; settings: any }>('/api/admin/settings/keys', data);
  },
  async testAiIntegration(): Promise<{ success: boolean; message: string; latencyMs?: number; responseSample?: string }> {
    return api.post<{ success: boolean; message: string; latencyMs?: number; responseSample?: string }>('/api/admin/settings/test-ai');
  },
};
