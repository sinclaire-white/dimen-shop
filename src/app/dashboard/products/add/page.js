import { ProductForm } from '@/components/admin/ProductForm';

// Static data - can be moved to database later
const categories = [
  { id: 'characters', name: '3D Characters' },
  { id: 'environment', name: 'Environment Packs' },
  { id: 'props', name: 'Props & Assets' },
  { id: 'vehicles', name: 'Vehicles' },
  { id: 'buildings', name: 'Buildings' },
  { id: 'weapons', name: 'Weapons' },
];

const fileFormats = ['STL', 'OBJ', 'FBX', 'BLEND', '3MF', 'AMF'];
const printMaterials = ['PLA', 'ABS', 'PETG', 'TPU', 'Resin', 'Nylon', 'Metal Filament'];

export default function AddProductPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Static Header */}
      <div className="flex items-center gap-4">
        <a href="/dashboard/products" className="inline-flex">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
            ←
          </button>
        </a>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">Add a new 3D model to your collection</p>
        </div>
      </div>

      {/* Interactive Form Component */}
      <ProductForm 
        categories={categories}
        fileFormats={fileFormats}
        printMaterials={printMaterials}
      />
    </div>
  );
}