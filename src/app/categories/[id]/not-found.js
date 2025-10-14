// app/categories/[id]/not-found.js

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <div className="mb-8">
          <Package className="w-20 h-20 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-4">Category Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The category you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/products">
              <Package className="w-5 h-5 mr-2" />
              Browse All Products
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              Go to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
