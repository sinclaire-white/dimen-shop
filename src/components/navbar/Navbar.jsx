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
import { LogOut, User, Menu, Package, Heart } from 'lucide-react';
import { signIn, signOut } from 'next-auth/react';
import ThemeToggle from '../ThemeToggle';

export default function Navbar() {
  const { user } = useSyncedUser();

  // Handle user logout with NextAuth
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Google OAuth sign-in handler
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  // PRODUCT CATEGORIES DATA
  // This can later be fetched from database/API
  const productCategories = [
    { name: '3D Characters', href: '/products/characters', description: 'Animated characters and avatars' },
    { name: 'Environment Packs', href: '/products/environment', description: 'Complete scene environments' },
    { name: 'Props & Assets', href: '/products/props', description: 'Individual items and objects' },
    { name: 'Vehicles', href: '/products/vehicles', description: 'Cars, planes, and other vehicles' },
    { name: 'Buildings', href: '/products/buildings', description: 'Architectural structures' },
    { name: 'Weapons', href: '/products/weapons', description: 'Guns, swords, and medieval weapons' },
  ];

  // MAIN NAVIGATION ITEMS
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
          
          {/* LOGO SECTION */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-primary">
              DimenShop
            </Link>
          </div>

          {/* DESKTOP NAVIGATION - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                
                {/* HOME LINK */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/" 
                      className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* PRODUCTS DROPDOWN MENU */}
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

                {/* OTHER NAVIGATION ITEMS (About, FAQ, Contact) */}
                {navItems.slice(1).map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link 
                        href={item.href}
                        className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* DESKTOP USER ACTIONS - Right side of navbar */}
          <div className="hidden md:flex items-center space-x-3">
            {/* THEME TOGGLE SWITCH */}
            <ThemeToggle />

            {/* USER PROFILE DROPDOWN OR AUTH BUTTONS */}
            {user ? (
              // LOGGED IN USER: Show avatar dropdown
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
              // LOGGED OUT USER: Show sign up/login buttons
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

          {/* MOBILE MENU - Hamburger menu for small screens */}
          <div className="md:hidden flex items-center space-x-2">
            {/* MOBILE THEME TOGGLE */}
            <ThemeToggle />

            {/* MOBILE SIDEBAR SHEET */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  
                  {/* MOBILE NAVIGATION LINKS */}
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* MOBILE PRODUCTS SECTION */}
                  <div className="border-l-2 border-primary pl-4 mt-4">
                    <Link
                      href="/products"
                      className="text-lg font-medium text-primary py-2 block"
                    >
                      Products 
                    </Link>
                  </div>

                  {/* MOBILE USER SECTION - Changes based on auth status */}
                  <div className="border-t pt-4 mt-4">
                    {user ? (
                      // MOBILE LOGGED IN USER VIEW
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="h-10 w-10">
                          {user.image && <AvatarImage src={user.image} alt={user.name} />}
                          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem asChild>
                                <Link href="/dashboard" className="flex items-center w-full">
                                  <User className="mr-2 h-4 w-4" />
                                  Dashboard
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href="/orders" className="flex items-center w-full">
                                  <Package className="mr-2 h-4 w-4" />
                                  Orders
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href="/favorites" className="flex items-center w-full">
                                  <Heart className="mr-2 h-4 w-4" />
                                  Favorites
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={handleLogout} className="flex items-center w-full">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ) : (
                      // MOBILE LOGGED OUT USER VIEW
                      <div className="flex flex-col space-y-3">
                        <div className="text-sm font-medium text-foreground mb-2">Account</div>
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
                        <div className="relative my-4">
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
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}