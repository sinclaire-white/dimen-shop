// components/layout/Navbar.jsx - Updated version
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSyncedUser } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger,
  navigationMenuTriggerStyle 
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { LogOut, User, Menu, Package, Heart, Search, X, ChevronDown } from 'lucide-react';
import { signIn, signOut } from 'next-auth/react';
import ThemeToggle from '../ThemeToggle';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { user } = useSyncedUser();
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);

  // Fetch categories from database
  useEffect(() => {
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
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  // Main navigation items
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'All Products' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  // Close mobile menu when navigating
  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
    setMobileSubmenu(null);
  };

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

          {/* DESKTOP NAVIGATION */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                
                {/* HOME LINK */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/" 
                      className={navigationMenuTriggerStyle()}
                    >
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* PRODUCTS DROPDOWN */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Products
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4 md:w-[500px] lg:w-[600px]">
                      <div className="grid grid-cols-2 gap-4">
                        {categories.map((category) => (
                          <Link
                            key={category._id}
                            href={`/categories/${category._id}`}
                            className="block p-3 rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div className="text-sm font-medium text-foreground group-hover:text-primary">
                              {category.name}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {category.description || 'Browse products in this category'}
                            </div>
                          </Link>
                        ))}
                        {categories.length === 0 && (
                          <div className="col-span-2 text-center py-4 text-muted-foreground">
                            No categories available
                          </div>
                        )}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* OTHER NAV ITEMS */}
                {navItems.slice(1).map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link 
                        href={item.href}
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* DESKTOP SEARCH & USER ACTIONS */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* SEARCH BAR */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9 w-64 bg-muted/50 border-0 focus:bg-background transition-colors"
              />
            </div>

            {/* THEME TOGGLE */}
            <ThemeToggle />

            {/* USER PROFILE */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                    <Avatar className="h-8 w-8">
                      {user.image && <AvatarImage src={user.image} alt={user.name} />}
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="flex items-center cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Favorites</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Link href="/signup">
                  <Button variant="outline" size="sm">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU - IMPROVED DESIGN */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* MOBILE SEARCH TRIGGER */}
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>

            {/* MOBILE THEME TOGGLE */}
            <ThemeToggle />

            {/* MOBILE MENU SHEET */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[350px] p-0">
                <div className="flex flex-col h-full">
                  {/* HEADER */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <Link href="/" className="text-xl font-bold text-primary" onClick={handleMobileLinkClick}>
                      DimenShop
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 overflow-y-auto">
                    {/* USER INFO */}
                    {user && (
                      <div className="p-4 border-b bg-muted/20">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            {user.image && <AvatarImage src={user.image} alt={user.name} />}
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* NAVIGATION */}
                    <div className="p-4 space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={handleMobileLinkClick}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* CATEGORIES SECTION */}
                    <div className="border-t pt-4">
                      <div className="px-4 mb-2">
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                          Categories
                        </h3>
                      </div>
                      
                      {mobileSubmenu === 'categories' ? (
                        // SUBMENU VIEW
                        <div className="space-y-1">
                          <button
                            onClick={() => setMobileSubmenu(null)}
                            className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ChevronDown className="h-4 w-4 mr-2 rotate-180" />
                            Back to Menu
                          </button>
                          {categories.map((category) => (
                            <Link
                              key={category._id}
                              href={`/categories/${category._id}`}
                              className="flex items-center px-6 py-2 text-sm hover:bg-accent transition-colors"
                              onClick={handleMobileLinkClick}
                            >
                              {category.name}
                            </Link>
                          ))}
                          {categories.length === 0 && (
                            <div className="px-6 py-2 text-sm text-muted-foreground">
                              No categories available
                            </div>
                          )}
                        </div>
                      ) : (
                        // MAIN MENU VIEW
                        <button
                          onClick={() => setMobileSubmenu('categories')}
                          className="flex items-center justify-between w-full px-4 py-2 text-base font-medium hover:bg-accent transition-colors"
                        >
                          <span>All Categories</span>
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* USER ACTIONS */}
                    <div className="border-t pt-4 px-4">
                      {user ? (
                        <div className="space-y-2">
                          <Button asChild variant="outline" className="w-full" onClick={handleMobileLinkClick}>
                            <Link href="/dashboard">
                              <User className="h-4 w-4 mr-2" />
                              Dashboard
                            </Link>
                          </Button>
                          <Button variant="outline" className="w-full" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Button asChild className="w-full" onClick={handleMobileLinkClick}>
                            <Link href="/login">
                              Login
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="w-full" onClick={handleMobileLinkClick}>
                            <Link href="/signup">
                              Sign Up
                            </Link>
                          </Button>
                          <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                              <span className="bg-background px-2 text-muted-foreground">Or</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            onClick={handleGoogleSignIn}
                            className="w-full"
                          >
                            Continue with Google
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}