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

export interface DashboardStats {
  users: {
    totalStudents: number;
    activeStudents: number;
    totalEmployers: number;
    verifiedEmployers: number;
    totalAdmins: number;
    freeUsers: number;
    paidSubscribers: number;
  };
  subscriptions: {
    activeSubscriptions: number;
    cancelledSubscriptions: number;
    mrrINR: number;
  };
  financials: {
    totalRevenueINR: number;
    successfulPayments: number;
    failedPayments: number;
    refundsCount: number;
    refundsAmountINR: number;
  };
  learning: {
    totalCourses: number;
    totalEnrollments: number;
    interviewsCompleted: number;
    creditsConsumed: number;
  };
  recruitment: {
    activeJobs: number;
    totalApplications: number;
  };
  recentTrends: Array<{
    _id: string;
    students: number;
    employers: number;
  }>;
}

export interface PlanItem {
  _id: string;
  code: string;
  name: string;
  monthlyPriceINR: number;
  yearlyPriceINR: number;
  description: string;
  features: string[];
  trialDays: number;
  interviewCredits: number;
  voiceInterviewEnabled: boolean;
  videoInterviewEnabled: boolean;
  resumeAnalysisLimit: number;
  courseAccess: string;
  isActive: boolean;
  isPopular: boolean;
  discountPercentage: number;
}

export interface CreditPackageItem {
  _id: string;
  name: string;
  quantity: number;
  priceINR: number;
  promotionalPriceINR?: number;
  validityDays: number;
  description: string;
  isActive: boolean;
}

export interface PaymentItem {
  _id: string;
  user: { _id: string; name: string; email: string; college?: string };
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  itemType: string;
  itemTitle: string;
  createdAt: string;
}

export interface RefundItem {
  _id: string;
  paymentId: { _id: string; razorpayOrderId?: string; razorpayPaymentId?: string; amount: number; status: string };
  userId: { _id: string; name: string; email: string };
  amountINR: number;
  reason: string;
  status: 'pending' | 'processed' | 'rejected';
  razorpayRefundId?: string;
  adminId?: { name: string; email: string };
  adminNotes?: string;
  processedAt?: string;
  createdAt: string;
}

export interface AIConfigData {
  providers: Array<{
    id: string;
    name: string;
    model: string;
    isActive: boolean;
    isDefault: boolean;
    isFallback: boolean;
    maxTokens: number;
    temperature: number;
    timeoutMs: number;
  }>;
  features: {
    mockInterviews: boolean;
    learningAssistant: boolean;
    resumeAnalyzer: boolean;
    projectMentor: boolean;
    codingAssistant: boolean;
  };
  scoringWeights: {
    technicalKnowledge: number;
    answerRelevance: number;
    problemSolving: number;
    communicationClarity: number;
    answerStructure: number;
    timeManagement: number;
  };
  interviewSettings: {
    defaultDurationMinutes: number;
    defaultQuestionCount: number;
    defaultDifficulty: string;
    allowCustomRoles: boolean;
    voiceEnabled: boolean;
    videoEnabled: boolean;
    creditCostPerInterview: number;
  };
  prompts: Array<{
    key: string;
    name: string;
    version: number;
    content: string;
    isActive: boolean;
    updatedAt: string;
  }>;
}

export interface SupportTicketItem {
  _id: string;
  ticketId: string;
  userId: { _id: string; name: string; email: string };
  userEmail: string;
  userName: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'waiting_for_user' | 'resolved' | 'closed';
  replies: Array<{
    sender: 'user' | 'admin';
    senderName: string;
    message: string;
    isInternal: boolean;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogItem {
  _id: string;
  adminEmail: string;
  adminRole: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  beforeValue?: any;
  afterValue?: any;
  ipAddress?: string;
  createdAt: string;
}

export const adminService = {
  // 1. Dashboard & Metrics
  async getMetrics(): Promise<{ metrics: AdminMetrics }> {
    return api.get<{ metrics: AdminMetrics }>('/api/admin/metrics');
  },
  async getDashboardStats(timeframe = '30d'): Promise<{ success: boolean; stats: DashboardStats }> {
    return api.get<{ success: boolean; stats: DashboardStats }>(`/api/admin/dashboard/stats?timeframe=${timeframe}`);
  },

  // 2. Users & Students
  async getStudents(params: Record<string, string> = {}): Promise<{ success: boolean; students: User[]; pagination: any }> {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/api/admin/users/students?${qs}`);
  },
  async getStudentById(id: string): Promise<any> {
    return api.get(`/api/admin/users/students/${id}`);
  },
  async updateStudentStatus(id: string, isSuspended: boolean, suspensionReason?: string): Promise<any> {
    return api.patch(`/api/admin/users/students/${id}/status`, { isSuspended, suspensionReason });
  },
  async adjustStudentCredits(id: string, amount: number, reason: string, type: 'grant' | 'deduct'): Promise<any> {
    return api.post(`/api/admin/users/students/${id}/adjust-credits`, { amount, reason, type });
  },

  // 3. Employers
  async getEmployers(params: Record<string, string> = {}): Promise<{ success: boolean; companies: any[] }> {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/api/admin/employers?${qs}`);
  },
  async updateEmployerVerification(id: string, isVerified: boolean, verificationNotes?: string): Promise<any> {
    return api.patch(`/api/admin/employers/${id}/verification`, { isVerified, verificationNotes });
  },

  // 4. Pricing & Plans
  async getPlans(): Promise<{ success: boolean; plans: PlanItem[] }> {
    return api.get('/api/admin/plans');
  },
  async createPlan(data: Partial<PlanItem>): Promise<any> {
    return api.post('/api/admin/plans', data);
  },
  async updatePlan(id: string, data: Partial<PlanItem>): Promise<any> {
    return api.put(`/api/admin/plans/${id}`, data);
  },
  async togglePlanStatus(id: string, isActive: boolean): Promise<any> {
    return api.patch(`/api/admin/plans/${id}/status`, { isActive });
  },

  // 5. Credit Packages & Subscriptions
  async getCreditPackages(): Promise<{ success: boolean; packages: CreditPackageItem[] }> {
    return api.get('/api/admin/credit-packages');
  },
  async createCreditPackage(data: Partial<CreditPackageItem>): Promise<any> {
    return api.post('/api/admin/credit-packages', data);
  },
  async updateCreditPackage(id: string, data: Partial<CreditPackageItem>): Promise<any> {
    return api.put(`/api/admin/credit-packages/${id}`, data);
  },
  async getSubscriptions(params: Record<string, string> = {}): Promise<{ success: boolean; subscriptions: any[]; pagination: any }> {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/api/admin/subscriptions?${qs}`);
  },

  // 6. Payments & Refunds
  async getPayments(params: Record<string, string> = {}): Promise<{ success: boolean; payments: PaymentItem[]; pagination: any }> {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/api/admin/payments?${qs}`);
  },
  async getRefunds(status = 'all'): Promise<{ success: boolean; refunds: RefundItem[] }> {
    return api.get(`/api/admin/refunds?status=${status}`);
  },
  async processRefund(data: { paymentId: string; amount: number; reason: string; adminNotes?: string }): Promise<any> {
    return api.post('/api/admin/refunds', data);
  },

  // 7. AI Configuration
  async getAIConfig(): Promise<{ success: boolean; config: AIConfigData }> {
    return api.get('/api/admin/ai/config');
  },
  async updateAIProviders(providers: any[]): Promise<any> {
    return api.put('/api/admin/ai/providers', { providers });
  },
  async updateScoringWeights(weights: any): Promise<any> {
    return api.put('/api/admin/ai/scoring-weights', weights);
  },
  async updateAIFeatures(data: any): Promise<any> {
    return api.put('/api/admin/ai/features', data);
  },
  async getAIUsage(): Promise<{ success: boolean; usage: any }> {
    return api.get('/api/admin/ai/usage');
  },

  // 8. Courses & Opportunities
  async getCourses(): Promise<{ success: boolean; courses: Course[] }> {
    return api.get('/api/admin/courses');
  },
  async createCourse(data: Partial<Course>): Promise<any> {
    return api.post('/api/admin/courses', data);
  },
  async updateCourse(id: string, data: Partial<Course>): Promise<any> {
    return api.put(`/api/admin/courses/${id}`, data);
  },
  async deleteCourse(id: string): Promise<any> {
    return api.delete(`/api/admin/courses/${id}`);
  },
  async getOpportunities(): Promise<{ success: boolean; opportunities: any[] }> {
    return api.get('/api/admin/jobs');
  },
  async createOpportunity(data: any): Promise<any> {
    return api.post('/api/admin/jobs', data);
  },
  async updateOpportunityStatus(id: string, status: string): Promise<any> {
    return api.patch(`/api/admin/jobs/${id}/status`, { status });
  },
  async getApplications(): Promise<{ success: boolean; applications: any[] }> {
    return api.get('/api/admin/applications');
  },

  // 9. Site Content & Platform Settings
  async getSiteContent(): Promise<{ success: boolean; content: any }> {
    return api.get('/api/admin/content');
  },
  async updateSiteContent(content: any): Promise<any> {
    return api.put('/api/admin/content', content);
  },
  async getPlatformSettings(): Promise<{ success: boolean; settings: any }> {
    return api.get('/api/admin/settings');
  },
  async updatePlatformSettings(settings: any): Promise<any> {
    return api.put('/api/admin/settings', settings);
  },

  // 10. Support Tickets & Broadcasts
  async getSupportTickets(params: Record<string, string> = {}): Promise<{ success: boolean; tickets: SupportTicketItem[] }> {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/api/admin/support?${qs}`);
  },
  async getSupportTicketById(id: string): Promise<{ success: boolean; ticket: SupportTicketItem }> {
    return api.get(`/api/admin/support/${id}`);
  },
  async replySupportTicket(id: string, data: { message: string; isInternal?: boolean; newStatus?: string }): Promise<any> {
    return api.post(`/api/admin/support/${id}/reply`, data);
  },
  async createBroadcastNotification(data: any): Promise<any> {
    return api.post('/api/admin/notifications', data);
  },

  // 11. Audit Logs & Admin Roles
  async getAuditLogs(params: Record<string, string> = {}): Promise<{ success: boolean; logs: AuditLogItem[]; pagination: any }> {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/api/admin/audit-logs?${qs}`);
  },
  async getAdminRoles(): Promise<{ success: boolean; admins: any[] }> {
    return api.get('/api/admin/roles');
  },
  async updateAdminRole(id: string, data: { adminRole?: string; permissions?: string[] }): Promise<any> {
    return api.patch(`/api/admin/roles/${id}`, data);
  },

  // Legacy Inquiries
  async getInquiries(): Promise<{ inquiries: ContactInquiry[] }> {
    return api.get<{ inquiries: ContactInquiry[] }>('/api/admin/inquiries');
  },
  async updateInquiryStatus(id: string, status: string): Promise<any> {
    return api.patch(`/api/admin/inquiries/${id}`, { status });
  },
};
