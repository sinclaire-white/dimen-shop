// app/categories/[id]/page.js
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card 
                key={product._id} 
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden aspect-square rounded-t-lg bg-muted/50">
                    <Link href={`/products/${product._id}`} className="block w-full h-full relative">
                      <Image
                        src={product.images?.[0] || '/placeholder.png'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </Link>
                    {product.featured && (
                      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <div className="p-4">
                    <Link href={`/products/${product._id}`}>
                      <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">
                          ${product.price}
                        </span>
                        {product.stock > 0 && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            {product.stock} in stock
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild className="flex-1">
                        <Link href={`/products/${product._id}`}>View Details</Link>
                      </Button>
                      <Button
                        size="sm"
                        disabled={product.stock === 0}
                        className="flex-1"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}