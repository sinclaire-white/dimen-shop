"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FavoriteButton from '@/components/products/FavoriteButton';
import AddToCartButton from '@/components/cart/AddToCartButton';
import BuyNowButton from '@/components/cart/BuyNowButton';
import { ShoppingCart, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UnifiedProductCard({ 
  product, 
  showBadge = false, 
  badge = 'Featured', 
  badgeColor = 'bg-primary text-primary-foreground',
  className = "",
  showFavorites = true,
  viewMode = 'grid' // 'grid' or 'list'
}) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imageKey, setImageKey] = useState(product.images?.[0]);

  // Reset loading state when product image changes
  useEffect(() => {
    const newImageSrc = product.images?.[0];
    if (newImageSrc !== imageKey) {
      setIsImageLoading(true);
      setImageKey(newImageSrc);
    }
  }, [product.images, imageKey]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.3, ease: 'easeOut' } 
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={className}
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full">
        <CardContent className="p-0 relative h-full flex flex-col">
          {/* Product Image */}
          <div className="relative overflow-hidden aspect-square bg-muted/50">
            <Link href={`/products/${product._id}`} className="block w-full h-full relative">
              <img
                key={imageKey}
                src={product.images?.[0] || '/placeholder.png'}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  isImageLoading && "scale-110 blur-sm opacity-0",
                  !isImageLoading && "scale-100 blur-0 opacity-100",
                  isHovered && !isImageLoading && "scale-105"
                )}
                loading="lazy"
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
              {isImageLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted/60 animate-pulse">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-muted-foreground/20 border-t-primary rounded-full animate-spin" />
                  </div>
                </div>
              )}
            </Link>

            {/* Badges */}
            {showBadge && (
              <Badge className={cn("absolute top-2 left-2", badgeColor)}>
                {badge}
              </Badge>
            )}
            
            {product.featured && !showBadge && (
              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                Featured
              </Badge>
            )}

            {product.stock === 0 && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Out of Stock
              </Badge>
            )}

            {/* Hover Actions */}
            <div className={cn(
              "absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <Button size="sm" variant="secondary" asChild>
                <Link href={`/products/${product._id}`}>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Link>
              </Button>
              {showFavorites && (
                <FavoriteButton 
                  productId={product._id} 
                  size="sm" 
                  variant="secondary"
                />
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex-1 flex flex-col">
              <Link href={`/products/${product._id}`}>
                <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                  {product.name}
                </h3>
              </Link>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
                {product.description}
              </p>

              {/* Category */}
              <div className="min-h-[1.5rem] mb-2">
                {product.category && (
                  <Badge variant="outline" className="text-xs">
                    {typeof product.category === 'object' ? product.category.name : product.category}
                  </Badge>
                )}
              </div>
            </div>

            {/* Price and Actions */}
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-lg font-bold text-foreground">
                    ৳{product.price}
                  </span>
                  {product.stock > 0 && product.stock <= 10 && (
                    <p className="text-xs text-orange-600 mt-1">
                      Only {product.stock} left
                    </p>
                  )}
                </div>
                {product.buyCount > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {product.buyCount} sold
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <BuyNowButton product={product} />
                <AddToCartButton product={product} />
              </div>
              
              {/* Details Button */}
              <Button 
                size="sm" 
                variant="outline" 
                asChild 
                className="w-full mt-2"
              >
                <Link href={`/products/${product._id}`}>
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Link>
              </Button>

              {/* Bottom Row with Favorites for Mobile */}
              {showFavorites && (
                <div className="mt-2 flex justify-center md:hidden">
                  <FavoriteButton 
                    productId={product._id} 
                    size="sm" 
                    variant="ghost"
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}