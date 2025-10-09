'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Reusable ProductCard used by Products page and FeaturedProducts.
 * Props: { product }
 */
export default function ProductCard({ product }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardContent className="p-0">
        <div className="relative overflow-hidden aspect-square rounded-lg bg-muted/50">
          <Link href={`/products/${product._id || product.id}`} className="block w-full h-full relative">
            <Image
              src={product.images?.[0] || '/placeholder.png'}
              alt={product.name || 'Product image'}
              fill
              sizes="(max-width: 1024px) 100vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105"
              unoptimized={false}
            />
          </Link>
        </div>

        <div className="p-4">
          <Link href={`/products/${product._id || product.id}`}>
            <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
              {product.stock > 0 && (
                <span className="text-xs text-green-600">{product.stock} in stock</span>
              )}
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href={`/products/${product._id || product.id}`}>View</Link>
              </Button>
              <Button
                size="sm"
                disabled={product.stock === 0}
                className={cn(product.stock === 0 && 'opacity-50 cursor-not-allowed')}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}