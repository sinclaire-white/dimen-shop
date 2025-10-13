'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Truck,
  Search,
  Filter
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingOrders, setUpdatingOrders] = useState(new Set());

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchAllOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Order ${newStatus} successfully`);
        await fetchAllOrders(); // Refresh orders
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update order');
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      toast.error('Failed to update order');
    } finally {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const getStatusConfig = (status) => {
    return statusConfig[status?.toLowerCase()] || statusConfig['pending'];
  };

  const canUpdateOrder = (order) => {
    return order.status !== 'cancelled' && order.status !== 'delivered';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded w-48" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground">
          Manage customer orders and update their status
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order number, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'No orders match your current filters.' 
                : 'No orders have been placed yet.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusConfig(order.status);
            const StatusIcon = statusInfo.icon;
            const isUpdating = updatingOrders.has(order._id);
            
            return (
              <Card key={order._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold">
                          {order.orderNumber || `Order #${order._id?.slice(-8).toUpperCase()}`}
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
                      
                      <div className="text-sm">
                        <span className="font-medium">Customer:</span> {order.userName} ({order.userEmail})
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {selectedOrder === order._id ? 'Hide' : 'View'} Details
                      </Button>
                      
                      {canUpdateOrder(order) && (
                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order._id, 'confirmed')}
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    <span>Updating...</span>
                                  </div>
                                ) : (
                                  'Confirm'
                                )}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => updateOrderStatus(order._id, 'cancelled')}
                                disabled={isUpdating}
                                className="bg-red-600 hover:bg-red-700 text-white border-red-600 font-medium"
                              >
                                {isUpdating ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    <span>Updating...</span>
                                  </div>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 mr-1 text-white" />
                                    Decline
                                  </>
                                )}
                              </Button>
                            </>
                          )}
                          
                          {order.status === 'confirmed' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order._id, 'processing')}
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    <span>Updating...</span>
                                  </div>
                                ) : (
                                  'Process'
                                )}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => updateOrderStatus(order._id, 'cancelled')}
                                disabled={isUpdating}
                                className="bg-red-600 hover:bg-red-700 text-white border-red-600 font-medium"
                              >
                                {isUpdating ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    <span>Updating...</span>
                                  </div>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 mr-1 text-white" />
                                    Decline
                                  </>
                                )}
                              </Button>
                            </>
                          )}
                          
                          {order.status === 'processing' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order._id, 'shipped')}
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <div className="flex items-center justify-center gap-2">
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  <span>Updating...</span>
                                </div>
                              ) : (
                                'Ship'
                              )}
                            </Button>
                          )}
                          
                          {order.status === 'shipped' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order._id, 'delivered')}
                              disabled={isUpdating}
                            >
                              {isUpdating ? 'Updating...' : 'Deliver'}
                            </Button>
                          )}
                        </div>
                      )}
                      
                      {order.status === 'cancelled' && (
                        <Badge variant="destructive" className="self-start">
                          Order Cancelled
                        </Badge>
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
                                    {item.product?.name || item.name || 'Unknown Product'}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>Qty: {item.quantity}</span>
                                    <span>•</span>
                                    <span>৳{item.price?.toFixed(2) || '0.00'}</span>
                                    <span>•</span>
                                    <span>Total: ৳{(item.quantity * (item.price || 0)).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping & Payment Info */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Shipping Address
                            </h4>
                            <div className="p-3 bg-muted/30 rounded-lg text-sm">
                              <p className="font-medium">{order.shippingAddress?.name}</p>
                              <p>{order.shippingAddress?.address}</p>
                              <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                              <p>{order.shippingAddress?.country}</p>
                              <p className="mt-2">📞 {order.shippingAddress?.phone}</p>
                              <p>✉️ {order.shippingAddress?.email}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Payment & Summary
                            </h4>
                            <div className="p-3 bg-muted/30 rounded-lg text-sm space-y-1">
                              <div className="flex justify-between">
                                <span>Payment Method:</span>
                                <span className="font-medium uppercase">{order.paymentMethod || 'COD'}</span>
                              </div>
                              <Separator className="my-2" />
                              <div className="flex justify-between font-semibold">
                                <span>Total Amount:</span>
                                <span>৳{order.totalAmount?.toFixed(2) || '0.00'}</span>
                              </div>
                            </div>
                          </div>
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