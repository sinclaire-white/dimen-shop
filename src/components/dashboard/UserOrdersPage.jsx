'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useSyncedUser } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

const statusConfig = {
  'pending': {
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    icon: Clock,
    label: 'Pending'
  },
  'confirmed': {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    icon: CheckCircle,
    label: 'Confirmed'
  },
  'processing': {
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    icon: Package,
    label: 'Processing'
  },
  'shipped': {
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    icon: Truck,
    label: 'Shipped'
  },
  'delivered': {
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    icon: CheckCircle,
    label: 'Delivered'
  },
  'cancelled': {
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    icon: XCircle,
    label: 'Cancelled'
  }
};

export default function UserOrdersPage() {
  const { user, orders, fetchOrders, cancelOrder, isLoading } = useSyncedUser();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);



  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancellingOrder(orderId);
    try {
      await cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      // Orders will be automatically refreshed by the cancelOrder function
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast.error('Failed to cancel order. Please try again.');
    } finally {
      setCancellingOrder(null);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
          <p className="text-muted-foreground">You need to be logged in to view your orders.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    return statusConfig[status?.toLowerCase()] || statusConfig['pending'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">
          Track and manage your order history
        </p>
      </div>

      {/* Orders List */}
      {!orders || orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
            <Button onClick={() => window.location.href = '/products'}>
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = getStatusConfig(order.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={order._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold">
                          Order #{order._id?.slice(-8).toUpperCase()}
                        </h3>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {order.items?.length || 0} items
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          ৳{order.totalAmount?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:min-w-fit">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                        className="shrink-0"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {selectedOrder === order._id ? 'Hide' : 'View'} Details
                      </Button>
                      {(order.status === 'pending' || order.status === 'confirmed') && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingOrder === order._id || isLoading}
                          className="bg-red-600 hover:bg-red-700 text-white border-red-600 shrink-0 font-medium"
                        >
                          <XCircle className="w-4 h-4 mr-1 text-white" />
                          {cancellingOrder === order._id ? 'Cancelling...' : 'Cancel Order'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Order Details - Expandable */}
                  {selectedOrder === order._id && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Items */}
                        <div>
                          <h4 className="font-semibold mb-3">Order Items</h4>
                          <div className="space-y-3">
                            {order.items?.map((item, index) => (
                              <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                                <div className="relative w-12 h-12 bg-muted rounded overflow-hidden">
                                  <Image
                                    src={item.product?.images?.[0] || '/placeholder.png'}
                                    alt={item.product?.name || 'Product'}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">
                                    {item.product?.name || 'Unknown Product'}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>Qty: {item.quantity}</span>
                                    <span>•</span>
                                    <span>৳{item.price}</span>
                                  </div>
                                </div>
                                <div className="text-sm font-semibold">
                                  ৳{(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping & Payment */}
                        <div className="space-y-4">
                          {/* Shipping Address */}
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Shipping Address
                            </h4>
                            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                              <p className="font-medium text-foreground">{order.shippingAddress?.name}</p>
                              <p>{order.shippingAddress?.address}</p>
                              <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                              <p>{order.shippingAddress?.country}</p>
                              <p className="mt-1">📞 {order.shippingAddress?.phone}</p>
                            </div>
                          </div>

                          {/* Payment Info */}
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Payment Details
                            </h4>
                            <div className="text-sm bg-muted/30 p-3 rounded-lg space-y-1">
                              <div className="flex justify-between">
                                <span>Payment Method:</span>
                                <span className="font-medium">
                                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>৳{((order.totalAmount || 0) - 50).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Shipping:</span>
                                <span>৳50.00</span>
                              </div>
                              <Separator className="my-2" />
                              <div className="flex justify-between font-semibold">
                                <span>Total:</span>
                                <span>৳{order.totalAmount?.toFixed(2) || '0.00'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Order Notes */}
                          {order.notes && (
                            <div>
                              <h4 className="font-semibold mb-2">Order Notes</h4>
                              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                                {order.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}