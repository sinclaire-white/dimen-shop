"use client";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSyncedUser, useUserStore } from '@/lib/store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function BuyNowButton({ product, size = "sm", className = "" }) {
  const { user } = useSyncedUser();
  const { addToCart } = useUserStore();
  const router = useRouter();

  const handleBuyNow = async () => {
    if (product.stock === 0) return;
    
    if (!user) {
      toast.error('Please log in to make a purchase');
      return;
    }

    try {
      // Add to cart first
      await addToCart(product._id, 1);
      // Redirect to checkout
      router.push('/cart');
      toast.success('Redirecting to checkout...');
    } catch (error) {
      toast.error('Failed to process request');
    }
  };

  return (
    <Button
      size={size}
      variant="outline"
      disabled={product.stock === 0}
      className={cn(
        "flex-1",
        product.stock === 0 && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={handleBuyNow}
    >
      {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
    </Button>
  );
}