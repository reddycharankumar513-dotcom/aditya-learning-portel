import { api } from './api';
import { User, AuthResponse } from '../types';

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    country?: string;
    educationStatus?: string;
    learningInterests: string[];
  }): Promise<AuthResponse> {
    return api.post<AuthResponse>('/api/auth/register', data);
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    return api.post<AuthResponse>('/api/auth/login', data);
  },

  async getMe(): Promise<{ user: User }> {
    return api.get<{ user: User }>('/api/auth/me');
  },

  async updateProfile(data: Partial<User>): Promise<{ user: User }> {
    return api.patch<{ user: User }>('/api/auth/profile', data);
  },

  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    return api.post<{ message: string; resetToken?: string }>('/api/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return api.post<{ message: string }>('/api/auth/reset-password', { token, newPassword });
  },

  logout(): void {
    localStorage.removeItem('aditya_auth_token');
  },
};
