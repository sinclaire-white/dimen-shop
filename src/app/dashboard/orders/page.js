// src/app/dashboard/orders/page.js

import { OrdersSearch } from '@/components/admin/OrdersSearch';
import { OrdersTable } from '@/components/admin/OrdersTable';


export default function Orders() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Page Header - Static */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track customer orders
        </p>
      </div>

      {/* Search Component */}
      <OrdersSearch />

      {/* Orders Table */}
      <OrdersTable />
    </div>
  );
}