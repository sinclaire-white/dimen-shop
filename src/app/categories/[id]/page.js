// app/categories/[id]/page.js
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UnifiedProductCard from '@/components/products/UnifiedProductCard';
import { Package, ShoppingCart } from 'lucide-react';
import { useProductStore } from '@/lib/store';
import AnimatedLoader from '@/components/ui/AnimatedLoader/AnimatedLoader';

export default function CategoryPage() {
  const params = useParams();
  
  // Use Zustand store
  const { 
    products, 
    category, 
    loading, 
    fetchCategoryWithProducts 
  } = useProductStore();

  useEffect(() => {
    if (params.id) {
      fetchCategoryWithProducts(params.id);
    }
  }, [params.id, fetchCategoryWithProducts]);

  if (loading) {
    return <AnimatedLoader />;
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The category youre looking for doesnt exist.
          </p>
          <Button asChild>
            <Link href="/products">
              <Package className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
              <p className="text-muted-foreground mt-1">
                {category.description || `Explore our collection of ${category.name}`}
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Card className="border border-muted">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Products Found
              </h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                There are currently no products available in {category.name}.
              </p>
              <Button asChild>
                <Link href="/products">
                  <Package className="w-4 h-4 mr-2" />
                  Browse All Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <UnifiedProductCard
                key={product._id}
                product={product}
                showBadge={product.featured}
                badge="Featured"
                badgeColor="bg-primary text-primary-foreground"
                showFavorites={true}
                className="h-full"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}