import { create } from 'zustand';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import axios from 'axios';

// ✅ User store: manages authenticated user data and operations
export const useUserStore = create((set, get) => ({
  user: null, // current logged-in user info
  isLoading: true, // tracks if user data is still loading
  favorites: [], // user's favorite products
  orders: [], // user's orders
  cart: [], // user's cart items
  cartCount: 0, // number of items in cart
  error: null,

  updateUser: (userData) => set({ user: userData, isLoading: false }), // update user info
  clearUser: () => set({ user: null, isLoading: false, favorites: [], orders: [], cart: [], cartCount: 0 }), // clear user data on logout
  setLoading: (loading) => set({ isLoading: loading }), // manually control loading state
  setError: (error) => set({ error }),

  // Profile management
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      let imageUrl = get().user?.image;
      
      // Upload image if provided
      if (profileData.profileImage) {
        const imageFormData = new FormData();
        imageFormData.append('image', profileData.profileImage);
        
        const imageResponse = await axios.post('/api/upload-imgbb', imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        imageUrl = imageResponse.data.url;
      }

      const response = await axios.put('/api/user/profile', {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone || '',
        address: profileData.address || '',
        image: imageUrl,
      });

      const updatedUser = response.data;
      set({ user: updatedUser, isLoading: false });
      return updatedUser;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  // Favorites management
  fetchFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/user/favorites');
      const favorites = response.data.favorites || [];
      set({ favorites, isLoading: false });
      return favorites;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch favorites';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  addToFavorites: async (productId) => {
    set({ error: null });
    try {
      await axios.post('/api/user/favorites', { productId });

      // Refresh favorites list
      get().fetchFavorites();
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to add to favorites';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  removeFromFavorites: async (productId) => {
    set({ error: null });
    try {
      await axios.delete('/api/user/favorites', { data: { productId } });

      // Update local favorites list
      const currentFavorites = get().favorites;
      const updatedFavorites = currentFavorites.filter(fav => fav._id !== productId);
      set({ favorites: updatedFavorites });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to remove from favorites';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Cart management
  fetchCart: async () => {
    try {
      const response = await axios.get('/api/user/cart');
      const cartItems = response.data.cart || [];
      const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      
      set({ cart: cartItems, cartCount });
      return cartItems;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch cart';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await axios.post('/api/user/cart', { productId, quantity });

      // Update local cart
      await get().fetchCart();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to add to cart';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axios.delete('/api/user/cart', { data: { productId } });

      // Update local cart
      await get().fetchCart();
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to remove from cart';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  updateCartQuantity: async (productId, quantity) => {
    try {
      await axios.put('/api/user/cart', { productId, quantity });

      // Update local cart
      await get().fetchCart();
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update cart';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  clearCart: async () => {
    try {
      await axios.delete('/api/user/cart/clear');

      set({ cart: [], cartCount: 0 });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to clear cart';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Orders management
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/user/orders');
      const orders = response.data.orders || [];
      set({ orders, isLoading: false });
    } catch (error) {
      // Handle case where user has no orders (404) as success
      if (error.response?.status === 404) {
        set({ orders: [], isLoading: false });
      } else {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch orders';
        set({ error: errorMessage, isLoading: false });
      }
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await axios.post('/api/user/orders', orderData);
      
      // Clear cart after successful order
      await get().clearCart();
      
      // Refresh orders
      await get().fetchOrders();
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create order';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  cancelOrder: async (orderId) => {
    try {
      await axios.put(`/api/user/orders/${orderId}`, { status: 'cancelled' });

      // Refresh orders
      await get().fetchOrders();
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to cancel order';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },
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
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.featured) params.featured = 'true';
      if (filters.limit) params.limit = filters.limit;
      if (filters.skip) params.skip = filters.skip;

      const response = await axios.get('/api/products', { params });
      
      set({ 
        products: response.data,
        lastProductsFetch: now,
        loading: false 
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch products';
      set({ error: errorMessage, loading: false });
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
      const response = await axios.get('/api/categories');
      
      set({ 
        categories: response.data,
        lastCategoriesFetch: now 
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch categories';
      set({ error: errorMessage });
    }
  },

  // Fetch featured products
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/api/products', { 
        params: { featured: 'true', limit: 8 }
      });
      
      set({ featuredProducts: response.data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch featured products';
      set({ error: errorMessage, loading: false });
    }
  },

  // Fetch popular products (by buy count)
  fetchPopularProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/api/products', { 
        params: { sort: 'buyCount', limit: 8 }
      });
      
      set({ popularProducts: response.data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch popular products';
      set({ error: errorMessage, loading: false });
    }
  },

  // Fetch category with products
  fetchCategoryWithProducts: async (categoryId) => {
    set({ loading: true, error: null });
    try {
      const [categoryResponse, productsResponse] = await Promise.all([
        axios.get(`/api/categories/${categoryId}`),
        axios.get('/api/products', { params: { category: categoryId } })
      ]);

      set({ 
        category: categoryResponse.data,
        products: productsResponse.data,
        loading: false 
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch category data';
      set({ error: errorMessage, loading: false });
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
      const response = await axios.get('/api/admin/analytics');
      set({ analytics: response.data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch analytics';
      set({ error: errorMessage, loading: false });
    }
  },

  // Fetch all users
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/api/admin/users');
      set({ users: response.data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch users';
      set({ error: errorMessage, loading: false });
    }
  },

  // Fetch orders
  fetchOrders: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/api/admin/orders');
      set({ orders: response.data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch orders';
      set({ error: errorMessage, loading: false });
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    set({ loading: true, error: null });
    try {
      await axios.put(`/api/admin/orders/${orderId}`, { status });
      
      // Refresh orders list
      await get().fetchOrders();
      set({ loading: false });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update order';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/users/${userId}`);
      
      // Refresh users list
      await get().fetchUsers();
      set({ loading: false });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete user';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Create product
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      await axios.post('/api/products', productData);
      
      // Refresh products list
      get().fetchProducts({ force: true });
      set({ loading: false });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create product';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  // Update product
  updateProduct: async (productId, productData) => {
    set({ loading: true });
    try {
      await axios.put(`/api/products/${productId}`, productData);
      
      // Refresh products list
      get().fetchProducts({ force: true });
      set({ loading: false });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update product';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/api/products/${productId}`);
      
      // Refresh products list by calling the product store
      useProductStore.getState().fetchProducts();
      set({ loading: false });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete product';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  // Category management
  categories: [],
  fetchCategories: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/api/categories');
      set({ categories: response.data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch categories';
      set({ error: errorMessage, loading: false });
    }
  },

  addCategory: async (categoryData) => {
    set({ loading: true });
    try {
      await axios.post('/api/categories', categoryData);
      
      // Refresh categories list
      get().fetchCategories();
      set({ loading: false });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create category';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  updateCategory: async (categoryData) => {
    set({ loading: true });
    try {
      await axios.put(`/api/categories/${categoryData.id}`, categoryData);
      
      // Refresh categories list
      get().fetchCategories();
      set({ loading: false });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update category';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  deleteCategory: async (categoryId) => {
    set({ loading: true });
    try {
      await axios.delete(`/api/categories/${categoryId}`);
      
      // Refresh categories list
      get().fetchCategories();
      set({ loading: false });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete category';
      set({ error: errorMessage, loading: false });
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
