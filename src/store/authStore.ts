import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { api } from '@/lib/api-client';
import type { User, AuthResponse } from '@shared/types';
type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};
type AuthActions = {
  login: (credentials: Record<string, string>) => Promise<void>;
  signup: (details: Record<string, string>) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
  initialize: () => Promise<void>;
};
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      clearError: () => set({ error: null }),
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await api<AuthResponse>('/api/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
          });
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      signup: async (details) => {
        set({ isLoading: true, error: null });
        try {
          const data = await api<AuthResponse>('/api/users/signup', {
            method: 'POST',
            body: JSON.stringify(details),
          });
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      logout: () => {
        set(initialState);
        set({ isLoading: false });
      },
      initialize: async () => {
        const token = get().token;
        if (token) {
          try {
            const user = await api<User>('/api/users/me', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            set({ user, isAuthenticated: true, isLoading: false });
          } catch (error) {
            // Token is invalid, log out
            get().logout();
          }
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }), // Only persist the token
    }
  )
);
