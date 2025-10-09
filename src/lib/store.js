// Global state management with Zustand for user, theme, and admin data

import { create } from 'zustand';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import axios from 'axios';

// User store: Manages authenticated user data
export const useUserStore = create((set) => ({
  user: null,
  isLoading: true,
  updateUser: (userData) => set({ user: userData, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

// Theme store: Handles light/dark mode with localStorage and system preferences
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

// Admin store: Manages dashboard data (analytics, products, orders, users, categories)
export const useAdminStore = create((set) => ({
  // Analytics data for dashboard metrics
  analytics: {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    monthlyGrowth: 0,
    popularProducts: [],
    recentOrders: []
  },
  // Products state
  products: [],
  // Orders state
  orders: [],
  // Users state
  users: [],
  // Categories state
  categories: [],
  // Set categories directly
  setCategories: (categories) => set({ categories }),
  // Fetch categories from API
  fetchCategories: async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      set({ categories: res.data });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },
  // Add a new category
  addCategory: async (newCategory) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, newCategory);
      set((state) => ({ categories: [...state.categories, res.data] }));
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  },
  // Delete a category by ID
  deleteCategory: async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, { data: { id } });
      set((state) => ({
        categories: state.categories.filter(cat => cat.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  },
  // Update a category
  updateCategory: async (updatedCategory) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, updatedCategory);
      set((state) => ({
        categories: state.categories.map(cat => 
          cat.id === updatedCategory.id ? res.data : cat
        )
      }));
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  },
  // Set products directly
  setProducts: (products) => set({ products }),
  // Fetch products from API
  fetchProducts: async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      set({ products: res.data });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  },
  // Add a new product
  addProduct: async (newProduct) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, newProduct);
      set((state) => ({ products: [...state.products, res.data] }));
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error; // Rethrow for form error handling
    }
  },
  // Delete a product by ID
 deleteProduct: async (id) => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
    set((state) => ({
      products: state.products.filter(product => product.id !== id)
    }));
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
},
  // Update a product
  updateProduct: async (updatedProduct) => {
  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${updatedProduct.id}`, updatedProduct);
    set((state) => ({
      products: state.products.map(product => 
        product.id === updatedProduct.id ? res.data : product
      )
    }));
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
},

// method to get single product
getProduct: async (id) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    throw error;
  }
},
  // Set analytics data
  setAnalytics: (analytics) => set({ analytics }),
  // Set orders data
  setOrders: (orders) => set({ orders }),
  // Set users data
  setUsers: (users) => set({ users }),
  // Fetch all dashboard data
  fetchDashboardData: async () => {
    try {
      const [analyticsRes, productsRes, ordersRes, usersRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`)
      ]);
      set({
        analytics: analyticsRes.data,
        products: productsRes.data,
        orders: ordersRes.data,
        users: usersRes.data
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  }
}));

// Hook to sync NextAuth session with Zustand user store
export const useSyncedUser = () => {
  const { data: session, status } = useSession();
  const { updateUser, clearUser, setLoading } = useUserStore();

  // Update user store based on session status
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

// Initialize theme on client-side
export const initializeTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    document.documentElement.className = theme;
    useThemeStore.setState({ theme, isInitialized: true });
  }
};