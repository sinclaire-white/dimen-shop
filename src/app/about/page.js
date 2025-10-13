import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Target, Users, Zap, Heart } from 'lucide-react';

export const metadata = {
  title: 'About Us | DimenShop',
  description: 'Learn about DimenShop - your trusted marketplace for premium 3D models since 2020. Our mission, values, and commitment to quality.',
};

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To democratize access to high-quality 3D assets, empowering creators worldwide."
  },
  {
    icon: Users,
    title: "Our Community", 
    description: "Building a thriving ecosystem for 3D artists and enthusiasts."
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Pushing boundaries of 3D technology to deliver cutting-edge assets."
  },
  {
    icon: Heart,
    title: "Passion Driven",
    description: "Every model crafted with love and attention to detail."
  }
];

const stats = [
  { number: "10K+", label: "3D Models" },
  { number: "50K+", label: "Customers" },
  { number: "150+", label: "Countries" },
  { number: "99.8%", label: "Satisfaction" }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="mt-4 md:mt-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About DimenShop
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your trusted marketplace for premium 3D models since 2020. 
            We connect creators with high-quality digital assets.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button size="lg">Browse Models</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              What drives us to deliver exceptional 3D assets every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}