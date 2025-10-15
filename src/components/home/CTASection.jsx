'use client';

import Link from 'next/link';
import { StarButton } from '@/components/ui/star-button';
import { useUserStore } from '@/lib/store';

export default function CTASection() {
  const { user } = useUserStore();

  if (user) return null;

  return (
    <section className="mt-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6">
          Ready to Start Your 3D Journey?
        </h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of creators who trust DimenShop for their 3D printing needs.
          Start exploring our collection today.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-12 justify-center items-center">
          <Link href="/products">
            <StarButton>
              Browse All Products
            </StarButton>
          </Link>
          <Link href="/signup">
            <StarButton>
              Create Account
            </StarButton>
          </Link>
        </div>
      </div>
    </section>
  );
}