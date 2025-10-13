"use client";
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSyncedUser } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function FavoritesPage() {
  const { user, favorites, isLoading, fetchFavorites, removeFromFavorites } = useSyncedUser();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  const handleRemoveFromFavorites = async (productId) => {
    try {
      await removeFromFavorites(productId);
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we load your favorites.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading favorites...</h2>
          <p className="text-muted-foreground">Please wait while we load your favorite products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
        <p className="text-muted-foreground">
          Products you&apos;ve saved for later. Total: {favorites.length} items
        </p>
      </div>

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="py-16 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-6">
                Start browsing products and add them to your favorites to see them here.
              </p>
              <Button asChild>
                <Link href="/products">
                  <Package className="h-4 w-4 mr-2" />
                  Browse Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="group hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Package className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Remove from favorites button */}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-red-500/90 hover:bg-red-600 text-white shadow-lg backdrop-blur-sm"
                      onClick={() => handleRemoveFromFavorites(product._id)}
                    >
                      <Trash2 className="h-4 w-4 text-white stroke-2 drop-shadow-sm" />
                    </Button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-2 mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-primary">
                          ৳{product.price}
                        </p>
                        {product.category && (
                          <Badge variant="secondary" className="text-xs">
                            {typeof product.category === 'object' ? product.category.name : product.category}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/products/${product._id}`}>
                            View
                          </Link>
                        </Button>
                        <Button size="sm">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Buy
                        </Button>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="text-xs text-muted-foreground space-y-1 min-h-[60px]">
                      {product.material && (
                        <p>Material: {product.material}</p>
                      )}
                      {product.dimensions && (
                        <p>Dimensions: {product.dimensions}</p>
                      )}
                      {product.stock !== undefined && (
                        <p>Stock: {product.stock} units</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}