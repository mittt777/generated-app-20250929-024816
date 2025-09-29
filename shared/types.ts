// SHARED TYPES
// Should be imported with alias "@shared/types"
export type ApiResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };
export interface User {
  id: string;
  name: string;
  email: string;
  // This is a mock password hash, in a real app, never expose this.
  passwordHash?: string;
  avatarUrl?: string;
  createdAt?: number;
}
export type PlanId = 'starter' | 'pro' | 'enterprise';
export interface Subscription {
  id: string; // Required by IndexedEntity, will be same as userId
  userId: string;
  planId: PlanId;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: number; // timestamp
  createdAt: number; // timestamp
}
export interface Transaction {
    id: string;
    customer: {
        name: string;
        email: string;
    };
    type: 'Sale' | 'Refund';
    status: 'Approved' | 'Pending' | 'Declined';
    date: string; // ISO 8601 format
    amount: number;
}
// API PAYLOADS
export interface AuthResponse {
  token: string;
  user: User;
}