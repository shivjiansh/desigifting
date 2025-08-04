'use client';

import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isModalOpen: false,
  modalContent: null,
  theme: 'light',

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  openModal: (content) => {
    set({ isModalOpen: true, modalContent: content });
  },

  closeModal: () => {
    set({ isModalOpen: false, modalContent: null });
  },

  setTheme: (theme) => {
    set({ theme });
    document.documentElement.classList.toggle('dark', theme === 'dark');
  },
}));

export default useUIStore;