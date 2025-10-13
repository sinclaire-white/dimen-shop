import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

// ProductCard component for displaying a single product
export default function ProductCard({ product, viewMode }) {
  return (
    <div className="card">
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square rounded-lg bg-muted/50">
        <Link href={`/products/${product._id}`} className="block w-full h-full relative">
          <Image
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 25vw"
            className="object-cover transition-transform hover:scale-105"
            unoptimized={false}
          />
        </Link>
      </div>
      {/* Product Info */}
      <div className={cn("p-4 flex-1", viewMode === 'list' && "flex flex-col justify-between")}>
        <div>
          <Link href={`/products/${product._id}`}>
            <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">${product.price}</span>
            {product.stock > 0 && (
              <span className="text-xs text-green-600">{product.stock} in stock</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/products/${product._id}`}>View</Link>
            </Button>
            <Button
              size="sm"
              disabled={product.stock === 0}
              className={cn(product.stock === 0 && "opacity-50 cursor-not-allowed")}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}