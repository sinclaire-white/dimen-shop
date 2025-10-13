// src/components/home/FeaturedProducts/ProductCard.jsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductCard({ 
  product, 
  showBadge = false, 
  badge = 'Featured', 
  badgeColor = 'bg-primary text-primary-foreground' 
}) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: 'easeOut' } 
    },
  };

  const imageVariants = {
    hover: { scale: 1.05 },
    initial: { scale: 1 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group overflow-hidden border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-0 relative">
          {/* Badge */}
          {showBadge && (
            <Badge 
              className={cn(
                "absolute top-3 left-3 z-10 text-xs font-medium",
                badgeColor
              )}
            >
              {badge}
            </Badge>
          )}

          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <motion.div
              variants={imageVariants}
              animate={isHovered ? "hover" : "initial"}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Image
                src={product.images?.[0] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className={cn(
                  "object-cover transition-all duration-500",
                  isImageLoading ? "blur-sm" : "blur-0"
                )}
                onLoad={() => setIsImageLoading(false)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </motion.div>

            {/* Hover Overlay */}
            <div className={cn(
              "absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center space-x-2",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <Button size="icon" variant="secondary" className="h-8 w-8">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="h-8 w-8">
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Link href={`/products/${product._id}`}>
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="space-y-2">
              {/* Category */}
              {product.categoryName && (
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {product.categoryName}
                </p>
              )}
              
              {/* Product Name */}
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              
              {/* Price */}
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-primary">
                  ${product.price?.toFixed(2) || '0.00'}
                </p>
                
                {/* Buy Count */}
                {product.buyCount > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {product.buyCount} sold
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center justify-between text-xs">
                <span className={cn(
                  "px-2 py-1 rounded-full",
                  product.stock > 0 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                )}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <Link href={`/products/${product._id}`} className="mt-3 block">
              <Button 
                className="w-full" 
                variant={product.stock > 0 ? "default" : "secondary"}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'View Details' : 'Out of Stock'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}