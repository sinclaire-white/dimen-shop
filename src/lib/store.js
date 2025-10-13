import { create } from 'zustand';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

// ✅ User store: manages authenticated user data
export const useUserStore = create((set) => ({
  user: null, // current logged-in user info
  isLoading: true, // tracks if user data is still loading

  updateUser: (userData) => set({ user: userData, isLoading: false }), // update user info
  clearUser: () => set({ user: null, isLoading: false }), // clear user data on logout
  setLoading: (loading) => set({ isLoading: loading }), // manually control loading state
}));

// ✅ Product store: manages products, categories, and filtering
export const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  featuredProducts: [],
  popularProducts: [],
  loading: false,
  error: null,
  
  // Cache timestamps to avoid unnecessary API calls
  lastProductsFetch: null,
  lastCategoriesFetch: null,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes

  // Fetch products with caching
  fetchProducts: async (filters = {}) => {
    const now = Date.now();
    const { lastProductsFetch, cacheTimeout } = get();
    
    // Use cache if recent fetch
    if (lastProductsFetch && now - lastProductsFetch < cacheTimeout && !filters.force) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.featured) queryParams.append('featured', 'true');
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.skip) queryParams.append('skip', filters.skip);

      const response = await fetch(`/api/products?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      set({ 
        products: data,
        lastProductsFetch: now,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Fetch categories with caching
  fetchCategories: async () => {
    const now = Date.now();
    const { lastCategoriesFetch, cacheTimeout } = get();
    
    if (lastCategoriesFetch && now - lastCategoriesFetch < cacheTimeout) {
      return;
    }

    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      set({ 
        categories: data,
        lastCategoriesFetch: now 
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Fetch featured products
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/products?featured=true&limit=8');
      if (!response.ok) throw new Error('Failed to fetch featured products');
      
      const data = await response.json();
      set({ featuredProducts: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Fetch popular products (by buy count)
  fetchPopularProducts: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/products?sort=buyCount&limit=8');
      if (!response.ok) throw new Error('Failed to fetch popular products');
      
      const data = await response.json();
      set({ popularProducts: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Fetch category with products
  fetchCategoryWithProducts: async (categoryId) => {
    set({ loading: true, error: null });
    try {
      const [categoryResponse, productsResponse] = await Promise.all([
        fetch(`/api/categories/${categoryId}`),
        fetch(`/api/products?category=${categoryId}`)
      ]);

      if (!categoryResponse.ok || !productsResponse.ok) {
        throw new Error('Failed to fetch category data');
      }

      const category = await categoryResponse.json();
      const products = await productsResponse.json();

      set({ 
        category,
        products,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Clear cache when needed
  clearCache: () => {
    set({
      lastProductsFetch: null,
      lastCategoriesFetch: null
    });
  }
}));

// ✅ Admin store: manages admin-specific functionality
export const useAdminStore = create((set, get) => ({
  users: [],
  orders: [],
  analytics: null,
  loading: false,
  error: null,

  // Fetch dashboard analytics
  fetchDashboardData: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const data = await response.json();
      set({ analytics: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Fetch all users
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      set({ users: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Fetch orders
  fetchOrders: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      set({ orders: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Create product
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!response.ok) throw new Error('Failed to create product');
      
      // Refresh products list
      get().fetchProducts({ force: true });
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  // Update product
  updateProduct: async (productId, productData) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!response.ok) throw new Error('Failed to update product');
      
      // Refresh products list
      get().fetchProducts({ force: true });
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete product');
      
      // Refresh products list by calling the product store
      useProductStore.getState().fetchProducts();
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  // Category management
  categories: [],
  fetchCategories: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      set({ categories: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addCategory: async (categoryData) => {
    set({ loading: true });
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) throw new Error('Failed to create category');
      
      // Refresh categories list
      get().fetchCategories();
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  updateCategory: async (categoryData) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/categories/${categoryData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) throw new Error('Failed to update category');
      
      // Refresh categories list
      get().fetchCategories();
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  deleteCategory: async (categoryId) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete category');
      
      // Refresh categories list
      get().fetchCategories();
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  }
}));

// ✅ Theme store: handles light/dark mode
export const useThemeStore = create((set) => ({
  theme: 'light', // default theme
  isInitialized: false, // prevents re-initialization

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.className = theme;
    }
    set({ theme, isInitialized: true });
  },

  toggleTheme: () =>
    set((state) => {
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
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      const theme = savedTheme || systemTheme;
      document.documentElement.className = theme;
      set({ theme, isInitialized: true });
    }
  },
}));

// ✅ Sync Zustand user store with NextAuth session
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

// ✅ Initialize theme on app start
export const initializeTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const theme = savedTheme || systemTheme;
    document.documentElement.className = theme;
    useThemeStore.setState({ theme, isInitialized: true });
  }
};
