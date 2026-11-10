import { api } from './api';

export interface PlanItem {
  id: string;
  name: string;
  tier: 'FREE' | 'STARTER' | 'PRO' | 'PREMIUM';
  price: number;
  interval: string;
  credits: number;
  description: string;
}

export interface CreditPackItem {
  id: string;
  name: string;
  price: number;
  credits: number;
  description: string;
}

export interface PaymentRecord {
  _id: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  itemType: string;
  itemId: string;
  itemTitle: string;
  creditsGranted: number;
  createdAt: string;
}

export const paymentService = {
  getPlans: async (): Promise<{
    success: boolean;
    currency: string;
    plans: PlanItem[];
    creditPacks: CreditPackItem[];
    keyId: string;
  }> => {
    return api.get('/api/payments/plans');
  },

  createOrder: async (
    itemType: 'plan_subscription' | 'credit_pack',
    itemId: string
  ): Promise<{
    success: boolean;
    order: {
      id: string;
      amount: number;
      currency: string;
      keyId: string;
      itemTitle: string;
      priceRupees: number;
    };
    paymentId: string;
  }> => {
    return api.post('/api/payments/create-order', { itemType, itemId });
  },

  verifyPayment: async (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature?: string;
  }): Promise<{
    success: boolean;
    message: string;
    payment: PaymentRecord;
    entitlements: {
      plan: string;
      credits: number;
      features: string[];
    };
  }> => {
    return api.post('/api/payments/verify', data);
  },

  getHistory: async (): Promise<{ success: boolean; payments: PaymentRecord[] }> => {
    return api.get('/api/payments/history');
  },
};
