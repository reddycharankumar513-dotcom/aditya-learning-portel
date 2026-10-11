import { api } from './api';
import { ContactInquiry } from '../types';

export const contactService = {
  async submitInquiry(data: {
    name: string;
    email: string;
    subject: string;
    category: string;
    message: string;
  }): Promise<{ message: string; inquiry: ContactInquiry }> {
    return api.post<{ message: string; inquiry: ContactInquiry }>('/api/contact', data);
  },
};
