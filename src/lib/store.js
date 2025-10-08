// lib/store.js: Global state management with Zustand (user, theme, admin dashboard, categories)

import { create } from 'zustand';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import axios from 'axios';

// User store section
export const useUserStore = create((set) => ({
  user: null,
  isLoading: true,
  updateUser: (userData) => set({ user: userData, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

// Theme store section (client-side only)
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

// Admin store section
export const useAdminStore = create((set) => ({
  // Analytics data
  analytics: {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    monthlyGrowth: 0,
    popularProducts: [],
    recentOrders: []
  },
  // Products data
  products: [],
  // Orders data
  orders: [],
  // Users data
  users: [],
  // Categories data
  categories: [],
  setCategories: (categories) => set({ categories }),
  fetchCategories: async () => {
    try {
      const res = await axios.get('/api/categories');
      set({ categories: res.data });
    } catch (error) {
      console.error('Failed to fetch categories:', error); // Log fetch failure
    }
  },
  addCategory: async (newCategory) => {
    try {
      const res = await axios.post('/api/categories', newCategory);
      set((state) => ({ categories: [...state.categories, res.data] }));
    } catch (error) {
      console.error('Failed to add category:', error); // Log add failure
    }
  },
  deleteCategory: async (id) => {
    try {
      await axios.delete('/api/categories', { data: { id } });
      set((state) => ({
        categories: state.categories.filter(cat => cat.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete category:', error); // Log delete failure
    }
  },
  updateCategory: async (updatedCategory) => {
    try {
      const res = await axios.put('/api/categories', updatedCategory);
      set((state) => ({
        categories: state.categories.map(cat => 
          cat.id === updatedCategory.id ? res.data : cat
        )
      }));
    } catch (error) {
      console.error('Failed to update category:', error); // Log update failure
    }
  },
  // Actions for other data
  setAnalytics: (analytics) => set({ analytics }),
  setProducts: (products) => set({ products }),
  setOrders: (orders) => set({ orders }),
  setUsers: (users) => set({ users }),
  fetchDashboardData: async () => {
    try {
      const [analyticsRes, productsRes, ordersRes, usersRes] = await Promise.all([
        axios.get('/api/admin/analytics'),
        axios.get('/api/admin/products'),
        axios.get('/api/admin/orders'),
        axios.get('/api/admin/users')
      ]);
      set({
        analytics: analyticsRes.data,
        products: productsRes.data,
        orders: ordersRes.data,
        users: usersRes.data
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error); // Log dashboard fetch failure
    }
  }
}));

// Session sync hook
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

// Client-side theme init
export const initializeTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    
    document.documentElement.className = theme;
    useThemeStore.setState({ theme, isInitialized: true });
  }
};