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

// Theme store for dark/light mode - completely client-side
export const useThemeStore = create((set) => ({
  theme: 'light',
  isInitialized: false,
  setTheme: (theme) => set({ theme, isInitialized: true }),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
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

// Admin Dashboard Store
export const useAdminStore = create((set) => ({
  // Analytics Data
  analytics: {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    monthlyGrowth: 0,
    popularProducts: [],
    recentOrders: []
  },
  // Products Data
  products: [],
  // Orders Data  
  orders: [],
  // Users Data
  users: [],
  
  // Actions
  setAnalytics: (analytics) => set({ analytics }),
  setProducts: (products) => set({ products }),
  setOrders: (orders) => set({ orders }),
  setUsers: (users) => set({ users }),
  
  // Fetch all dashboard data
  fetchDashboardData: async () => {
    try {
      // Simulate API calls - replace with actual endpoints
      const analyticsRes = await fetch('/api/admin/analytics');
      const productsRes = await fetch('/api/admin/products');
      const ordersRes = await fetch('/api/admin/orders');
      const usersRes = await fetch('/api/admin/users');
      
      const [analytics, products, orders, users] = await Promise.all([
        analyticsRes.json(),
        productsRes.json(),
        ordersRes.json(),
        usersRes.json()
      ]);
      
      set({ analytics, products, orders, users });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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

// Client-side theme initialization
export const initializeTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    
    // Apply theme to document
    document.documentElement.className = theme;
    
    // Initialize store
    useThemeStore.setState({ theme, isInitialized: true });
  }
};