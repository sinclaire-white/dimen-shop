'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useUserStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  MapPin, 
  Package, 
  ArrowLeft,
  Check,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

export default function CheckoutClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { 
    user,
    cart, 
    cartCount, 
    loading, 
    fetchCart, 
    createOrder 
  } = useUserStore();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  // Pre-fill form with user data from store
  useEffect(() => {
    if (!user) return;
    
    // Pre-fill form with user data
    setValue('name', user.name || '');
    setValue('email', user.email || '');
    setValue('phone', user.phone || '');
    
    // If user has a saved address, parse and populate it
    if (user.address) {
      // Try to parse structured address (street, city, postal code)
      const addressParts = user.address.split(',').map(part => part.trim());
      
      if (addressParts.length === 1) {
        // Single address string - put it all in address field
        setValue('address', user.address);
      } else {
        // Multiple parts - try to distribute them
        setValue('address', addressParts[0] || '');
        if (addressParts.length >= 2) {
          setValue('city', addressParts[1] || '');
        }
        if (addressParts.length >= 3) {
          // Look for postal code pattern (numbers)
          const lastPart = addressParts[addressParts.length - 1];
          if (/^\d+/.test(lastPart)) {
            setValue('postalCode', lastPart || '');
            // If there are more parts, use them for city
            if (addressParts.length > 3) {
              setValue('city', addressParts.slice(1, -1).join(', '));
            }
          } else {
            setValue('city', addressParts.slice(1).join(', '));
          }
        }
      }
    }
  }, [user, setValue]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
      return;
    }
    
    if (session) {
      fetchCart();
    }
  }, [session, status, fetchCart, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!loading && (!cart || cart.length === 0)) {
      router.push('/cart');
    }
  }, [cart, loading, router]);

  const subtotal = (cart || []).reduce((sum, item) => {
    if (!item || !item.product || typeof item.product.price !== 'number' || typeof item.quantity !== 'number') {
      return sum;
    }
    return sum + (item.product.price * item.quantity);
  }, 0);
  
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  const onSubmit = async (data) => {
    if (!cart || cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country || 'Bangladesh'
        },
        paymentMethod: data.paymentMethod || 'cod',
        notes: data.notes || ''
      };

      const result = await createOrder(orderData);
      toast.success('Order placed successfully!');
      router.push('/dashboard/orders');
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-48" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="h-96 bg-muted rounded" />
                </div>
                <div className="space-y-6">
                  <div className="h-96 bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => router.push('/cart')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Checkout</h1>
              <p className="text-muted-foreground">
                Complete your order details
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Details & Shipping Form */}
              <div className="space-y-6">
                {/* Shipping Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Information
                      {userProfile && (
                        <Badge variant="secondary" className="ml-auto">
                          <Check className="h-3 w-3 mr-1" />
                          Auto-filled
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userProfile && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg mb-4">
                        <Check className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Your profile information has been loaded. Please review and update as needed.
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          {...register('name', { required: 'Name is required' })}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        {...register('phone', { required: 'Phone number is required' })}
                        placeholder="+880 1XXX-XXXXXX"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        {...register('address', { required: 'Address is required' })}
                        placeholder="Street address, apartment, suite, etc."
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          {...register('city', { required: 'City is required' })}
                          className={errors.city ? 'border-red-500' : ''}
                        />
                        {errors.city && (
                          <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          {...register('postalCode')}
                          placeholder="1200"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        {...register('country')}
                        defaultValue="Bangladesh"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="cod"
                          value="cod"
                          {...register('paymentMethod')}
                          defaultChecked
                          className="w-4 h-4"
                        />
                        <Label htmlFor="cod" className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Cash on Delivery (COD)
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        Pay when your order is delivered to your doorstep
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Notes (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      {...register('notes')}
                      placeholder="Any special instructions for your order..."
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart?.map((item) => (
                        <div key={item.product._id} className="flex gap-3 p-3 border border-muted rounded-lg">
                          <div className="relative w-16 h-16 bg-muted rounded overflow-hidden">
                            <Image
                              src={item.product.images?.[0] || '/placeholder.png'}
                              alt={item.product.name || 'Product'}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">
                              {item.product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Qty: {item.quantity}
                              </Badge>
                              <span className="text-sm font-semibold">
                                ৳{item.product.price}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm font-semibold">
                            ৳{(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Order Totals */}
                    <div className="space-y-2">
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

                    {/* Place Order Button */}
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Place Order (৳{total.toFixed(2)})
                        </>
                      )}
                    </Button>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <AlertCircle className="h-3 w-3" />
                      <span>By placing this order, you agree to our terms and conditions</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}