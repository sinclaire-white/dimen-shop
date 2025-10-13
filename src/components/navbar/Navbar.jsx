// components/layout/Navbar.jsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navigation from './Navigation';


export default function Navbar({ initialCategories = [] }) {
  const [categories, setCategories] = useState(initialCategories);

  // Fetch categories from database (fallback for client-side navigation)
  useEffect(() => {
    // Only fetch if we don't have initial categories
    if (initialCategories.length === 0) {
      const fetchCategories = async () => {
        try {
          const response = await fetch('/api/categories');
          if (response.ok) {
            const data = await response.json();
            setCategories(data);
          }
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        }
      };
      fetchCategories();
    }
  }, [initialCategories.length]);

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
          <Navigation categories={categories} />
        </div>
      </div>
    </nav>
  );
}