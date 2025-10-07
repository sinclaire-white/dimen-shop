'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function ProductsHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage your 3D model products and inventory
        </p>
      </div>
      <Link href="/dashboard/products/add">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </Link>
    </div>
  );
}