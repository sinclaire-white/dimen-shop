"use client";
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useSyncedUser, useUserStore } from '@/lib/store';

export default function CartButton() {
  const { user } = useSyncedUser();
  const { cart, cartCount, fetchCart } = useUserStore();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  if (!user) return null;

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-foreground text-background border-background"
          >
            {cartCount > 99 ? '99+' : cartCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}