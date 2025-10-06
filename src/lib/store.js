// lib/store.js
import { create } from 'zustand';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';  

// Core Zustand store: Holds user data and actions
export const useUserStore = create((set) => ({
  user: null,  // Current user object (e.g., { id, email, name, role })
  isLoading: true,  // Global loading state for auth/user checks
  // Action: Update user data and stop loading
  updateUser: (userData) => set({ user: userData, isLoading: false }),
  // Action: Clear user on logout
  clearUser: () => set({ user: null, isLoading: false }),
  // Action: Set loading state (e.g., during sign-up)
  setLoading: (loading) => set({ isLoading: loading }),
}));

// Custom hook: Syncs Zustand store with NextAuth session
export const useSyncedUser = () => {
  const { data: session, status } = useSession();  // Get session status/data
  const { updateUser, clearUser, setLoading } = useUserStore();  // Store actions

  // useEffect: Sync only after render 
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
    } else if (status === 'authenticated' && session?.user) {
      // User signed in: Update store with session data
      setLoading(false);
      updateUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role || 'user',  // Fallback for missing roles
        image: session.user.image,  // Optional profile pic
      });
    } else if (status === 'unauthenticated') {
      // User signed out: Clear store
      setLoading(false);
      clearUser();
    }
  }, [status, session, updateUser, clearUser, setLoading]);  // Dependencies: Re-run on change

  // Return full store for component use
  return useUserStore();
};