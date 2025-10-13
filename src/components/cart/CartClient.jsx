'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUserStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag,
  ArrowRight,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

export default function CartClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { 
    cart, 
    cartCount, 
    loading, 
    fetchCart, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity,
    createOrder 
  } = useUserStore();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/cart');
      return;
    }
    
    if (session) {
      fetchCart().then(() => {
        console.log('Cart fetched:', cart);
      });
    }
  }, [session, status, fetchCart, router]);

  // Debug cart changes
  useEffect(() => {
    console.log('Cart updated:', cart, 'Count:', cartCount);
    console.log('updateCartQuantity function available:', typeof updateCartQuantity);
  }, [cart, cartCount, updateCartQuantity]);

  const handleQuantityChange = async (productId, newQuantity) => {
    console.log('Quantity change requested:', { productId, newQuantity });
    
    if (newQuantity === 0) {
      await handleRemoveItem(productId);
      return;
    }

    if (newQuantity < 0) {
      console.log('Negative quantity rejected:', newQuantity);
      return; // Don't allow negative quantities
    }

    try {
      console.log('Calling updateCartQuantity with:', { productId, newQuantity });
      await updateCartQuantity(productId, newQuantity);
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
      console.error('Quantity update error:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };



  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 bg-muted animate-pulse rounded-md w-48 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-muted rounded-lg" />
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                          <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                          <div className="h-4 bg-muted rounded w-1/4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="space-y-4">
                <Card className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-1/2 mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-6 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = (cart || []).reduce((sum, item) => {
    if (!item || !item.product || typeof item.product.price !== 'number' || typeof item.quantity !== 'number') {
      console.warn('Invalid cart item:', item);
      return sum;
    }
    return sum + (item.product.price * item.quantity);
  }, 0);
  const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over ৳1000
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>

          {!cart || cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. 
                Start shopping to fill it with amazing 3D printed products!
              </p>
              <Button asChild size="lg">
                <Link href="/products">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Start Shopping
                </Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Items in Cart</h2>
                    <div className="space-y-4">
                      {cart.map((item, index) => {
                        // Guard clause for missing product data
                        if (!item.product || !item.product._id) {
                          return null;
                        }
                        
                        return (
                        <motion.div
                          key={item.product._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex gap-4 p-4 border border-muted rounded-lg">
                            {/* Product Image */}
                            <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden">
                              <Image
                                src={item.product.images?.[0] || '/placeholder.png'}
                                alt={item.product.name || 'Product'}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1">
                              <Link 
                                href={`/products/${item.product._id}`}
                                className="font-semibold hover:text-primary transition-colors"
                              >
                                {item.product.name || 'Unnamed Product'}
                              </Link>
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.product.description?.substring(0, 80) || 'No description available'}...
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {typeof item.product.category === 'object' 
                                    ? item.product.category?.name || 'Unknown Category'
                                    : item.product.category || 'Unknown Category'}
                                </Badge>
                                <span className="text-lg font-bold text-primary">
                                  ৳{item.product.price || 0}
                                </span>
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex flex-col items-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleRemoveItem(item.product._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    console.log('Minus clicked, current quantity:', item.quantity);
                                    handleQuantityChange(item.product._id, item.quantity - 1);
                                  }}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    console.log('Plus clicked, current quantity:', item.quantity);
                                    handleQuantityChange(item.product._id, item.quantity + 1);
                                  }}
                                  disabled={item.quantity >= (item.product.stock || 0)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="text-sm font-semibold">
                                ৳{((item.product.price || 0) * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal ({cartCount} items)</span>
                        <span>৳{subtotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span className={shipping === 0 ? 'text-green-600' : ''}>
                          {shipping === 0 ? 'FREE' : `৳${shipping}`}
                        </span>
                      </div>
                      
                      {shipping === 0 && (
                        <p className="text-xs text-green-600">
                          Free shipping on orders over ৳1000
                        </p>
                      )}
                      
                      <Separator />
                      
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>৳{total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-6" 
                      size="lg"
                      onClick={() => router.push('/checkout')}
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Continue Shopping */}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}