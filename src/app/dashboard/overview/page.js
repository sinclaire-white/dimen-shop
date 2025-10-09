
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


const dummyData = [
  { month: 'Jan', sales: 400, users: 120 },
  { month: 'Feb', sales: 300, users: 98 },
  { month: 'Mar', sales: 500, users: 150 },
];

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
            <CardDescription>$12,500</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12.5k</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Active accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>Available items</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">89</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">45</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsCharts />
        </CardContent>
      </Card>
    </div>
  );
}