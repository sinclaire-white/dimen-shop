// src/app/dashboard/orders/page.js

import { OrdersSearch } from '@/components/admin/OrdersSearch';
import { OrdersTable } from '@/components/admin/OrdersTable';

const mockOrders = [
  { id: 'ORD-1001', customer: 'john@example.com', date: '2024-01-15', amount: 49.99, status: 'Completed', items: 1 },
  { id: 'ORD-1002', customer: 'sarah@example.com', date: '2024-01-14', amount: 129.97, status: 'Processing', items: 3 },
  { id: 'ORD-1003', customer: 'mike@example.com', date: '2024-01-14', amount: 79.99, status: 'Completed', items: 1 },
  { id: 'ORD-1004', customer: 'lisa@example.com', date: '2024-01-13', amount: 34.99, status: 'Pending', items: 1 },
];

export default function Orders() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header - Static */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track customer orders
        </p>
      </div>

      {/* Search Component */}
      <OrdersSearch />

      {/* Orders Table */}
      <OrdersTable orders={mockOrders} />
    </div>
  );
}