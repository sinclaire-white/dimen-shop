import { StatsGrid } from '@/components/admin/StatsGrid';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header - Static */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome to your DimenShop admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Charts Section */}
      <AnalyticsCharts />
    </div>
  );
}