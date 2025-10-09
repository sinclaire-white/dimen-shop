// app/page.js - Updated home page
import { FeaturedProducts } from '@/components/home/FeaturedProducts/FeaturedProducts';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Newsletter } from '@/components/home/Newsletter';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import HeroBanner from '@/components/home/HeroBanner/HeroBanner';
import Categories from '@/components/home/categories/Categories';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroBanner></HeroBanner>
      <Categories></Categories>
      {/* Categories section */}
    
      {/* Featured Products Section */}
      <FeaturedProducts></FeaturedProducts>

      {/* Why Choose Us Section */}
      <WhyChooseUs></WhyChooseUs>

      {/* CTA Section */}
     <CTASection></CTASection>
      {/* Newsletter Section */}
      <Newsletter></Newsletter>

    </div>
  );
}