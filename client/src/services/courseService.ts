import { api } from './api';
import { Course } from '../types';

export const courseService = {
  async getCourses(params?: { category?: string; difficulty?: string; search?: string }): Promise<{ courses: Course[] }> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return api.get<{ courses: Course[] }>(`/api/courses${queryString}`);
  },

  async getCourseBySlug(slug: string): Promise<{ course: Course }> {
    return api.get<{ course: Course }>(`/api/courses/${slug}`);
  },

  async getFeaturedCourses(): Promise<{ courses: Course[] }> {
    return api.get<{ courses: Course[] }>('/api/courses/featured');
  },
};
