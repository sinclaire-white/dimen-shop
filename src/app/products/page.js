import { Suspense } from 'react';
import ProductsClient from '@/components/products/ProductsClient';
import AnimatedLoader from '@/components/ui/AnimatedLoader/AnimatedLoader';

export const metadata = {
  title: 'All Products | DimenShop',
  description: 'Browse our complete collection of high-quality 3D printed products. Perfect for home, office, and creative projects.',
  openGraph: {
    title: 'All Products | DimenShop',
    description: 'Browse our complete collection of high-quality 3D printed products.',
    type: 'website',
  },
};

// Enable ISR - Revalidate every 12 hours
export const revalidate = 43200;

export default function ProductsPage() {
  return (
    <Suspense fallback={<AnimatedLoader />}>
      <ProductsClient />
    </Suspense>
  );
}