"use client";
import { useSyncedUser } from '@/lib/store';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { OrdersSearch } from '@/components/admin/OrdersSearch';
import UserOrdersPage from '@/components/dashboard/UserOrdersPage';

export default function OrdersPage() {
  const { user } = useSyncedUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we load your orders.</p>
        </div>
      </div>
    );
  }

  // Show different orders page based on user role
  if (user.role === 'admin') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Page Header - Static */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Orders Management</h1>
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

  return <UserOrdersPage />;
}