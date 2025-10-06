'use client';

import Link from 'next/link';
import { useSyncedUser } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
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
import { LogOut, User, Menu, Package, Heart, HelpCircle, Info } from 'lucide-react';
import { signOut } from 'next-auth/react';
import ThemeToggle from '../ThemeToggle';

export default function Navbar() {
  const { user } = useSyncedUser();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Dummy categories for products dropdown
  const productCategories = [
    { name: '3D Characters', href: '/products/characters', description: 'Animated characters and avatars' },
    { name: 'Environment Packs', href: '/products/environment', description: 'Complete scene environments' },
    { name: 'Props & Assets', href: '/products/props', description: 'Individual items and objects' },
    { name: 'Vehicles', href: '/products/vehicles', description: 'Cars, planes, and other vehicles' },
    { name: 'Buildings', href: '/products/buildings', description: 'Architectural structures' },
    { name: 'Weapons', href: '/products/weapons', description: 'Guns, swords, and medieval weapons' },
  ];

  // Navigation items for reuse
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-primary">
              DimenShop
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Home */}
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {/* Products with Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-foreground hover:text-primary">
                    Products
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-4 md:w-[500px] lg:w-[600px]">
                      <div className="grid grid-cols-2 gap-4">
                        {productCategories.map((category) => (
                          <Link
                            key={category.href}
                            href={category.href}
                            className="block p-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="text-sm font-medium text-foreground">
                              {category.name}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {category.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Other Navigation Items */}
                {navItems.slice(1).map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop User Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User or Auth Buttons */}
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

          {/* Mobile Menu Button - Visible only on mobile */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle for Mobile */}
            <ThemeToggle />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Navigation Items */}
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Products Categories in Mobile */}
                  <div className="border-l-2 border-primary pl-4">
                    <div className="text-sm font-semibold text-foreground mb-2">Products</div>
                    {productCategories.map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        className="block text-sm text-muted-foreground hover:text-primary py-1 pl-2"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  
                  {/* Mobile User Section */}
                  <div className="border-t pt-4 mt-4">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 mb-4">
                          <Avatar className="h-8 w-8">
                            {user.image && <AvatarImage src={user.image} alt={user.name} />}
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Link href="/dashboard" className="flex items-center text-foreground hover:text-primary py-2">
                          <User className="mr-3 h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link href="/orders" className="flex items-center text-foreground hover:text-primary py-2">
                          <Package className="mr-3 h-4 w-4" />
                          Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center text-foreground hover:text-primary w-full py-2"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <Link href="/signup">
                          <Button variant="outline" className="w-full">
                            Sign Up
                          </Button>
                        </Link>
                        <Link href="/login">
                          <Button className="w-full">
                            Login
                          </Button>
                        </Link>
                      </div>
                    )}
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