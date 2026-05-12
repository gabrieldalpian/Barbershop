import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from './apiClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'BARBER';
  specialty?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  register: (name: string, email: string, password: string, role?: 'CUSTOMER' | 'BARBER', specialty?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
}

function setAuthCookie(token: string | null) {
  if (typeof document === 'undefined') return;
  if (token) {
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  } else {
    document.cookie = 'token=; path=/; max-age=0';
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      register: async (name, email, password, role = 'CUSTOMER', specialty) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post('/auth/register', { name, email, password, role, specialty });
          const { user, token } = response.data;
          setAuthCookie(token);
          set({ user, token, isLoading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post('/auth/login', { email, password });
          const { user, token } = response.data;
          setAuthCookie(token);
          set({ user, token, isLoading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        setAuthCookie(null);
        set({ user: null, token: null });
      },

      hydrate: () => {
        // persist middleware handles rehydration — this is a no-op kept for compatibility
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
