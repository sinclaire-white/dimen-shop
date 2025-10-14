// components/layout/Navbar.jsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navigation from './Navigation';
import { useProductStore } from '@/lib/store';


export default function Navbar({ initialCategories = [] }) {
  const { categories, fetchCategories } = useProductStore();

  // Fetch categories with caching
  useEffect(() => {
    // Fetch categories (will use cache if available)
    fetchCategories();
  }, [fetchCategories]);

  // Use store categories, fallback to initialCategories
  const displayCategories = categories.length > 0 ? categories : initialCategories;

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              DimenShop
            </Link>
          </div>

          {/* NAVIGATION COMPONENT */}
          <Navigation categories={displayCategories} />
        </div>
      </div>
    </nav>
  );
}