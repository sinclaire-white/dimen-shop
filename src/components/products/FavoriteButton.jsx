"use client";
import { useState } from 'react';
import { useSyncedUser } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function FavoriteButton({ productId, className, size = "sm", variant = "outline" }) {
  const { user, favorites, addToFavorites, removeFromFavorites } = useSyncedUser();
  const [isLoading, setIsLoading] = useState(false);

  // Check if product is in favorites
  const isFavorite = favorites?.some(fav => fav._id === productId);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('Please log in to add favorites');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        await removeFromFavorites(productId);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites(productId);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // Don't show favorite button if not logged in
  }

  return (
    <Button
      size={size}
      variant={isFavorite ? "default" : variant}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={cn(
        "gap-1",
        isFavorite && "text-red-500 hover:text-red-600",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4", 
          isFavorite && "fill-current"
        )} 
      />
      {isLoading ? 'Loading...' : (isFavorite ? 'Favorited' : 'Add to Favorites')}
    </Button>
  );
}