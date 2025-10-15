"use client";
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useSyncedUser, useUserStore } from '@/lib/store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AddToCartButton({ product, size = "sm", className = "" }) {
  const { user } = useSyncedUser();
  const { addToCart } = useUserStore();

  const handleAddToCart = async () => {
    if (product.stock === 0) return;
    
    if (!user) {
      toast.error('Please log in to add items to cart');
      return;
    }

    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <Button
      type="button"
      size={size}
      disabled={product.stock === 0}
      className={cn(
        "flex-1",
        product.stock === 0 && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={handleAddToCart}
    >
      <ShoppingCart className="w-4 h-4 mr-1" />
      {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
    </Button>
  );
}