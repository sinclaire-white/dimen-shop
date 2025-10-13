
// src/app/dashboard/products/page.js

import { ProductsHeader } from '@/components/admin/ProductsHeader';
import { ProductsList } from '@/components/admin/ProductsList';

export default function Products() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with Add Button */}
      <ProductsHeader />
      
      {/* Products List with integrated search */}
      <ProductsList />
    </div>
  );
}