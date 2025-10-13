// components/home/FeaturedProducts.jsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useProductStore } from '@/lib/store';
import UnifiedProductCard from '@/components/products/UnifiedProductCard';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function FeaturedProducts() {
  const { featuredProducts, fetchFeaturedProducts, loading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-muted animate-pulse rounded-md w-64 mx-auto mb-4" />
            <div className="h-4 bg-muted animate-pulse rounded-md w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                  <div className="h-6 bg-muted rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Star className="h-6 w-6 text-muted-foreground mr-2" />
            <h2 className="text-3xl font-bold">Featured Products</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            No featured products available at the moment. Check back later!
          </p>
        </div>
      </section>
    );
  }

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
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Star className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked premium 3D printed products showcasing the best of our collection
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuredProducts.slice(0, 6).map((product, index) => (
            <motion.div key={product._id} variants={itemVariants} className="h-full">
              <UnifiedProductCard 
                product={product} 
                showBadge={true}
                badge="⭐ Featured"
                badgeColor="bg-primary text-primary-foreground"
                className="h-full"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
          >
            Explore All Products
          </a>
        </motion.div>
      </div>
    </section>
  );
}