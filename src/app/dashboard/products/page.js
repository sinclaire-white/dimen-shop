
// src/app/dashboard/products/page.js

import { Suspense } from 'react';
import { ProductsHeader } from '@/components/admin/ProductsHeader';
import { ProductsList } from '@/components/admin/ProductsList';
import AnimatedLoader from '@/components/ui/AnimatedLoader/AnimatedLoader';

export default function Products() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with Add Button */}
      <ProductsHeader />
      
      {/* Products List with integrated search */}
      <Suspense fallback={<AnimatedLoader />}>
        <ProductsList />
      </Suspense>
    </div>
  );
}