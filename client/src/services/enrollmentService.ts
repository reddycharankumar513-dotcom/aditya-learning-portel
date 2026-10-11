import { api } from './api';
import { Enrollment } from '../types';

export const enrollmentService = {
  async enroll(courseId: string): Promise<{ message: string; enrollment: Enrollment }> {
    return api.post<{ message: string; enrollment: Enrollment }>(`/api/enrollments/${courseId}/enroll`);
  },

  async getMyEnrollments(): Promise<{ enrollments: Enrollment[] }> {
    return api.get<{ enrollments: Enrollment[] }>('/api/enrollments/me');
  },

  async getEnrollment(courseId: string): Promise<{ enrollment: Enrollment | null; isEnrolled: boolean }> {
    return api.get<{ enrollment: Enrollment | null; isEnrolled: boolean }>(`/api/enrollments/check/${courseId}`);
  },

  async updateProgress(courseId: string, moduleId: string, completed: boolean): Promise<{ enrollment: Enrollment }> {
    return api.patch<{ enrollment: Enrollment }>(`/api/enrollments/${courseId}/progress`, {
      moduleId,
      completed,
    });
  },
};
