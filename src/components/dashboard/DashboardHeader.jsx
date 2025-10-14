// components/dashboard/DashboardHeader.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from '@/components/ThemeToggle';
import { usePathname } from 'next/navigation';
import { useSyncedUser } from '@/lib/store';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Users, 
  ShoppingCart, 
  User,
  Heart
} from 'lucide-react';

const adminSidebarItems = [
  { title: 'Overview', href: '/dashboard/overview', icon: LayoutDashboard },
  { title: 'Products', href: '/dashboard/products', icon: Package },
  { title: 'Categories', href: '/dashboard/categories', icon: Tags },
  { title: 'Users', href: '/dashboard/users', icon: Users },
  { title: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
];

const userSidebarItems = [
  { title: 'Overview', href: '/dashboard/overview', icon: LayoutDashboard },
  { title: 'My Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { title: 'Favorites', href: '/dashboard/favorites', icon: Heart },
  { title: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useSyncedUser();

  const sidebarItems = user?.role === 'admin' ? adminSidebarItems : userSidebarItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Mobile Menu + Back to Home */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-foreground">DimenShop</h2>
                    <p className="text-sm text-muted-foreground">
                      {user?.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
                    </p>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 p-4 space-y-2">
                    {sidebarItems.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <motion.div key={item.href} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

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