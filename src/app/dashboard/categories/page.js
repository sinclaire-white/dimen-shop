// /dashboard/categories/page.js
import { CategoryManager } from '@/components/admin/CategoryManager';
import Link from 'next/link';

export default function Categories() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Back button + header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
            ←
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage product categories for your 3D models</p>
        </div>
      </div>

      {/* Interactive manager */}
      <CategoryManager />
    </div>
  );
}