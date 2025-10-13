// app/page.js 

import CTASection from '@/components/home/CTASection';
import HeroBanner from '@/components/home/HeroBanner/HeroBanner';
import { Newsletter } from '@/components/home/Newsletter';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import Categories from '@/components/home/categories/Categories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts/FeaturedProducts';
import { PopularProducts } from '@/components/home/PopularProducts/PopularProducts';

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

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroBanner />
      
      {/* Categories section */}
      <Categories />
    
      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Popular Products Section */}
      <PopularProducts />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* CTA Section */}
      <CTASection />
      
      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
}