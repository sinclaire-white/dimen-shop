"use client";
import { useSyncedUser } from '@/lib/store';
import AdminOrdersPage from '@/components/admin/AdminOrdersPage';
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
    return <AdminOrdersPage />;
  }

  return <UserOrdersPage />;
}