// src/components/admin/ProductsHeader.jsx

'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function ProductsHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage your 3D model products and inventory
        </p>
      </div>
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </div>
  );
}