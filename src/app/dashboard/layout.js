import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Dashboard - DimenShop',
  description: 'Admin dashboard for DimenShop',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}