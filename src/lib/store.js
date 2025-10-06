import { create } from 'zustand';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';  

// Core Zustand store: Holds user data and actions
export const useUserStore = create((set) => ({
  user: null,
  isLoading: true,
  updateUser: (userData) => set({ user: userData, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

// Theme store for dark/light mode
export const useThemeStore = create((set) => ({
  theme: 'light', // Default theme
  isInitialized: false, // Track if theme is initialized
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.className = theme;
    }
    set({ theme, isInitialized: true });
  },
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      document.documentElement.className = newTheme;
    }
    return { theme: newTheme, isInitialized: true };
  }),
  initializeTheme: () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const theme = savedTheme || systemTheme;
      document.documentElement.className = theme;
      set({ theme, isInitialized: true });
    }
  }
}));

// Custom hook: Syncs Zustand store with NextAuth session
export const useSyncedUser = () => {
  const { data: session, status } = useSession();
  const { updateUser, clearUser, setLoading } = useUserStore();

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
    } else if (status === 'authenticated' && session?.user) {
      setLoading(false);
      updateUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role || 'user',
        image: session.user.image,
      });
    } else if (status === 'unauthenticated') {
      setLoading(false);
      clearUser();
    }
  }, [status, session, updateUser, clearUser, setLoading]);

  return useUserStore();
};