import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user:    null,
      token:   null,
      isInitialized: false,
      setAuth: (user, token) => set({ user, token, isInitialized: true }),
      setInitialized: (val) => set({ isInitialized: val }),
      logout:  () => set({ user: null, token: null, isInitialized: true }),
    }),
    { 
      name: 'auth',
      partialize: (state) => ({ user: state.user, token: state.token })
    }
  )
);
