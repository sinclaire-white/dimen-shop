'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useProductStore } from '@/lib/store';
import UnifiedProductCard from '@/components/products/UnifiedProductCard';
import { ProductsFilters } from '@/components/products/ProductsFilters';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Grid, List, Package } from 'lucide-react';

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const { 
    products = [], 
    categories = [], 
    fetchProducts, 
    fetchCategories 
  } = useProductStore();

  const [filters, setFilters] = useState({
    category: '',
    sort: 'newest',
    search: searchQuery
  });
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Update search filter when URL search param changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, search: searchQuery }));
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Apply client-side filtering
  const filteredProducts = (products || []).filter(product => {
    const productCategoryId = typeof product.category === 'object' 
      ? product.category._id 
      : product.category;
    const matchesCategory = !filters.category || productCategoryId === filters.category;
    const matchesSearch = !filters.search || 
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    switch (filters.sort) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'popular':
        return (b.buyCount || 0) - (a.buyCount || 0);
      default: // newest
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">All Products</h1>
          <p className="text-muted-foreground">
            Discover our complete collection of premium 3D printed products
          </p>
        </div>

        {/* Filters */}
        <ProductsFilters 
          categories={categories}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* View Mode Toggle & Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'grid grid-cols-1 gap-4'
            }
          >
            {filteredProducts.map((product) => (
              <motion.div key={product._id} variants={itemVariants} className="h-full">
                <UnifiedProductCard product={product} className="h-full" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}