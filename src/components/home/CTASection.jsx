'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/lib/store';

export default function CTASection() {
  const { user } = useUserStore();

  if (user) return null;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6">
          Ready to Start Your 3D Journey?
        </h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of creators who trust DimenShop for their 3D printing needs.
          Start exploring our collection today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant="secondary"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            asChild
          >
            <Link href="/products">
              Browse All Products
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground text-primary"
            asChild
          >
            <Link href="/signup">
              Create Account
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}