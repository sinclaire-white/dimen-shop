// components/dashboard/DashboardHeader.jsx
'use client';

import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Back to Home */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-accent">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Store</span>
                <span className="sm:hidden">Home</span>
              </Button>
            </Link>
            
            <div className="hidden sm:block h-6 w-px bg-border" />
            
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary w-8 h-8 flex items-center justify-center">
                <span className="font-bold text-primary-foreground text-sm">D</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-foreground">DimenShop Dashboard</h1>
                <p className="text-xs text-muted-foreground">Manage your store</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-base font-semibold text-foreground">Dashboard</h1>
              </div>
            </div>
          </div>

          {/* Right side - Theme Toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}