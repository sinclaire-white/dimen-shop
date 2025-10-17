// src/components/home/categories/Categories.jsx

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { BorderBeam } from '@/components/ui/border-beam';
import { Package } from 'lucide-react';

async function fetchCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/categories`, { cache: 'force-cache', next: { revalidate: 86400 } }); // 24 hours
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

export default async function Categories() {
  const categories = await fetchCategories();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Browse Categories</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our organized collection of 3D models by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category._id} href={`/categories/${category._id}`}>
              <Card className="relative group hover:shadow-lg transition-all duration-300 cursor-pointer h-full overflow-hidden">
                <CardContent className="p-6 text-center h-full flex flex-col">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                    {category.description || `Explore ${category.name} models`}
                  </p>
                </CardContent>
                <BorderBeam duration={8} size={100} />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}