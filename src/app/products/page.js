import ProductsClient from '@/components/products/ProductsClient';

export const metadata = {
  title: 'All Products | DimenShop',
  description: 'Browse our complete collection of high-quality 3D printed products. Perfect for home, office, and creative projects.',
  openGraph: {
    title: 'All Products | DimenShop',
    description: 'Browse our complete collection of high-quality 3D printed products.',
    type: 'website',
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}