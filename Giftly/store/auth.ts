'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';


interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: { name: string; email: string; password: string; role: 'buyer' | 'seller' }) => Promise<User>;
  logout: () => void;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return data.user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return data.user;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
          });

        }
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      checkAuth: async () => {
        try {
          const response = await fetch('/api/auth/me');
          const data = await response.json();

          if (response.ok && data.user) {
            set({
              user: data.user,
              isAuthenticated: true,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'giftly-auth',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;

// // src/store/auth.ts
// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'

// interface AuthState {
//   user: {
//     id: string
//     name: string
//     email: string
//     avatar?: string
//   } | null
//   token: string | null
//   isAuthenticated: boolean
//   login: (userData: { user: any; token: string }) => void
//   logout: () => void
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       login: (userData) => set({
//         user: userData.user,
//         token: userData.token,
//         isAuthenticated: true,
//       }),
//       logout: () => set({
//         user: null,
//         token: null,
//         isAuthenticated: false,
//       }),
//     }),
//     {
//       name: 'auth-storage', // name for the localStorage key
//     }
//   )
// )

// // Optional: Export types for better TypeScript support
// export type { AuthState }