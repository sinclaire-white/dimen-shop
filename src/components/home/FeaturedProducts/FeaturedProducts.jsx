// components/home/FeaturedProducts.jsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useProductStore } from '@/lib/store';
import UnifiedProductCard from '@/components/products/UnifiedProductCard';
import { Card, CardContent } from '@/components/ui/card';
import { StarButton } from '@/components/ui/star-button';
import { Star } from 'lucide-react';

export function FeaturedProducts() {
  const { featuredProducts, fetchFeaturedProducts } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="mt-16 bg-background">
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
    <section className="mt-16 bg-background">
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
          <a href="/products">
            <StarButton>
              Explore All Products
            </StarButton>
          </a>
        </motion.div>
      </div>
    </section>
  );
}