"use client";
import { Suspense } from 'react';
import { useSyncedUser } from '@/lib/store';
import AdminOrdersPage from '@/components/admin/AdminOrdersPage';
import UserOrdersPage from '@/components/dashboard/UserOrdersPage';
import AnimatedLoader from '@/components/ui/AnimatedLoader/AnimatedLoader';

export default function OrdersPage() {
  const { user } = useSyncedUser();

  if (!user) {
    return <AnimatedLoader />;
  }

  // Show different orders page based on user role
  if (user.role === 'admin') {
    return (
      <Suspense fallback={<AnimatedLoader />}>
        <AdminOrdersPage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<AnimatedLoader />}>
      <UserOrdersPage />
    </Suspense>
  );
}