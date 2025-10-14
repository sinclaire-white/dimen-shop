// app/page.js 

import { Suspense } from 'react';
import CTASection from '@/components/home/CTASection';
import HeroBanner from '@/components/home/HeroBanner/HeroBanner';
import { Newsletter } from '@/components/home/Newsletter';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import Categories from '@/components/home/categories/Categories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts/FeaturedProducts';
import { PopularProducts } from '@/components/home/PopularProducts/PopularProducts';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'DimenShop - Premium 3D Printed Products',
  description: 'Discover high-quality 3D printed products for your home, office, and creative projects. Custom designs and premium materials.',
  keywords: '3D printing, custom products, 3D models, printed accessories',
  openGraph: {
    title: 'DimenShop - Premium 3D Printed Products',
    description: 'Discover high-quality 3D printed products for your home, office, and creative projects.',
    type: 'website',
  },
};

// Skeleton component for products
function ProductsSkeleton() {
  return (
    <section className="mt-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-8 bg-muted animate-pulse rounded-md w-64 mx-auto mb-4" />
          <div className="h-4 bg-muted animate-pulse rounded-md w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                <div className="h-6 bg-muted rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroBanner />
      
      {/* Categories section */}
      <Categories />
    
      {/* Featured Products Section */}
      <Suspense fallback={<ProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>

      {/* Popular Products Section */}
      <Suspense fallback={<ProductsSkeleton />}>
        <PopularProducts />
      </Suspense>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* CTA Section */}
      <CTASection />
      
      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
}