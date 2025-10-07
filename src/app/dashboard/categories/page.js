import { CategoryManager } from '@/components/admin/CategoryManager';

// Static categories data
const initialCategories = [
  { id: '1', name: '3D Characters', productCount: 45 },
  { id: '2', name: 'Environment Packs', productCount: 23 },
  { id: '3', name: 'Props & Assets', productCount: 67 },
  { id: '4', name: 'Vehicles', productCount: 12 },
  { id: '5', name: 'Buildings', productCount: 34 },
  { id: '6', name: 'Weapons', productCount: 28 },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Static Header */}
      <div className="flex items-center gap-4">
        <a href="/dashboard" className="inline-flex">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
            ←
          </button>
        </a>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage product categories for your 3D models</p>
        </div>
      </div>

      {/* Interactive Category Manager */}
      <CategoryManager initialCategories={initialCategories} />
    </div>
  );
}