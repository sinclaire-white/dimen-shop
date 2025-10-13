"use client";
import { useSyncedUser } from '@/lib/store';
import Overview from '@/components/admin/Overview';
import UserOverview from '@/components/dashboard/UserOverview';

export default function OverviewPage() {
  const { user } = useSyncedUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  // Show different overview based on user role
  if (user.role === 'admin') {
    return <Overview />;
  }

  return <UserOverview />;
}