
// src/app/dashboard/products/page.js


import { ProductsHeader } from '@/components/admin/ProductsHeader';
import { ProductsSearch } from '@/components/admin/ProductsSearch';
import { ProductsList } from '@/components/admin/ProductsList';

const mockProducts = [
  { id: 1, name: 'Cyberpunk Character', price: 49.99, category: 'Characters', status: 'Active', stock: 45 },
  { id: 2, name: 'Modern City Pack', price: 79.99, category: 'Environments', status: 'Active', stock: 23 },
  { id: 3, name: 'Sci-Fi Weapons Bundle', price: 34.99, category: 'Weapons', status: 'Draft', stock: 0 },
  { id: 4, name: 'Fantasy Castle', price: 89.99, category: 'Buildings', status: 'Active', stock: 12 },
];

export default function Products() {
  return (
    <div className="p-6 space-y-6">
      {/* Header with Add Button */}
      <ProductsHeader />
      
      {/* Search Component */}
      <ProductsSearch />
      
      {/* Products List */}
      <ProductsList products={mockProducts} />
    </div>
  );
}