import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export const metadata = {
  title: 'Dashboard - DimenShop',
  description: 'Admin dashboard for DimenShop',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 lg:ml-64">
        <DashboardHeader />
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}