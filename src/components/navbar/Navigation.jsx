'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSyncedUser } from '@/lib/store';
import { signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ThemeToggle';
import { Button } from '@/components/ui/button';
import { ShinyButton } from '@/components/ui/shiny-button';
import { LogoutConfirmDialog } from '@/components/ui/logout-confirm-dialog';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
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
import CartButton from '@/components/cart/CartButton';
import {
  LogOut,
  User,
  Menu,
  Package,
  Heart,
  Search,
  ChevronDown,
  X,
} from 'lucide-react';

// Navigation component
export default function Navigation({ categories }) {
  const { user } = useSyncedUser();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileSearchOpen(false); // Close mobile search sheet
    }
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setLogoutDialogOpen(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'All Products' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
    setMobileSubmenu(null);
  };

  return (
    <>
      {/* Desktop Navigation - Large screens only */}
      <div className="hidden lg:flex items-center space-x-4 flex-1 justify-end">
        <NavigationMenu>
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild>
                  <Link href={item.href} className={navigationMenuTriggerStyle()}>
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            {/* Categories Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm font-medium">
                Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[400px] p-4 md:w-[500px] lg:w-[600px]">
                  <div className="grid grid-cols-2 gap-4">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/categories/${category._id}`}
                          className="block p-3 rounded-lg hover:bg-accent transition-colors group"
                        >
                          <div className="text-sm font-medium group-hover:text-primary">
                            {category.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {category.description || 'Browse products in this category'}
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-4 text-muted-foreground">
                        No categories available
                      </div>
                    )}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Dashboard Dropdown - Role Based - Mobile Only */}
            {user && (
              <NavigationMenuItem className="md:hidden">
                <NavigationMenuTrigger className="text-sm font-medium">
                  Dashboard
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[300px] p-4">
                    <div className="space-y-2">
                      {user.role === 'admin' ? (
                        <>
                          <Link
                            href="/dashboard/overview"
                            className="block p-3 rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div className="text-sm font-medium group-hover:text-primary">
                              Overview
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Dashboard analytics and statistics
                            </div>
                          </Link>
                          <Link
                            href="/dashboard/products"
                            className="block p-3 rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div className="text-sm font-medium group-hover:text-primary">
                              Products
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Manage product inventory
                            </div>
                          </Link>
                          <Link
                            href="/dashboard/categories"
                            className="block p-3 rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div className="text-sm font-medium group-hover:text-primary">
                              Categories
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Organize product categories
                            </div>
                          </Link>
                          <Link
                            href="/dashboard/users"
                            className="block p-3 rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div className="text-sm font-medium group-hover:text-primary">
                              Users
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Manage user accounts
                            </div>
                          </Link>
                          <Link
                            href="/dashboard/orders"
                            className="block p-3 rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div className="text-sm font-medium group-hover:text-primary">
                              Orders
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Track and manage orders
                            </div>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/dashboard"
                            className="block p-3 rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div className="text-sm font-medium group-hover:text-primary">
                              My Dashboard
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              View your profile and settings
                            </div>
                          </Link>
                          <Link
                            href="/dashboard/orders"
                            className="block p-3 rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div className="text-sm font-medium group-hover:text-primary">
                              My Orders
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              View your order history
                            </div>
                          </Link>
                          <Link
                            href="/dashboard/favorites"
                            className="block p-3 rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div className="text-sm font-medium group-hover:text-primary">
                              Favorites
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Your saved products
                            </div>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search Bar - Cool Animated Modal for ALL Screens */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setMobileSearchOpen(true)}
          className="h-9 w-9"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Cart Button */}
        <CartButton />

        {/* User Menu */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full cursor-pointer">
                <Avatar className="h-8 w-8">
                  {user.image && (
                    <AvatarImage src={user.image} alt={user.name} />
                  )}
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.name}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              {/* Dashboard Routes - Role Based */}
              {user.role === 'admin' ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/overview" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/products" className="flex items-center cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Manage Products</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/categories" className="flex items-center cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Manage Categories</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/users" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Manage Users</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/orders" className="flex items-center cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Manage Orders</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/orders" className="flex items-center cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/favorites" className="flex items-center cursor-pointer">
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
          <div className="flex space-x-1 md:space-x-2">
            <Link href="/signup">
              <ShinyButton variant="outline" size="sm" className="whitespace-nowrap px-3 md:px-4 lg:px-6 text-xs md:text-sm">
                Sign Up
              </ShinyButton>
            </Link>
            <Link href="/login">
              <ShinyButton size="sm" className="whitespace-nowrap px-3 md:px-4 lg:px-6 text-xs md:text-sm">
                Login
              </ShinyButton>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile & Medium Navigation */}
      <div className="lg:hidden flex items-center space-x-2">
        {/* Mobile Search Trigger - Opens Cool Animated Modal */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setMobileSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Mobile Theme Toggle */}
        <ThemeToggle />

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
                <Link 
                  href="/" 
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity" 
                  onClick={handleMobileLinkClick}
                >
                  <Image 
                    src="/dimen_shp_logo.png"
                    alt="DimenShop Logo"
                    width={35}
                    height={35}
                    className="object-contain"
                  />
                  <span className="text-lg font-bold text-primary">
                    DimenShop
                  </span>
                </Link>
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto">
              {/* USER INFO */}
              {user && (
                <div className="p-4 border-b bg-muted/20">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      {user.image && (
                        <AvatarImage src={user.image} alt={user.name} />
                      )}
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Menu */}
              <div className="p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-base font-medium rounded-md hover:bg-accent transition-colors"
                    onClick={handleMobileLinkClick}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Categories */}
              <div className="border-t pt-4">
                <div className="px-4 mb-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide">Categories</h3>
                </div>

                {mobileSubmenu === 'categories' ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => setMobileSubmenu(null)}
                      className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronDown className="h-4 w-4 mr-2 rotate-180" /> Back to Menu
                    </button>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/categories/${category._id}`}
                          className="flex items-center px-6 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={handleMobileLinkClick}
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <div className="px-6 py-2 text-sm text-muted-foreground">
                        No categories available
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setMobileSubmenu('categories')}
                    className="flex items-center justify-between w-full px-4 py-2 text-base font-medium hover:bg-accent transition-colors"
                  >
                    <span>All Categories</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Dashboard - Role Based */}
              {user && (
                <div className="border-t pt-4">
                  <div className="px-4 mb-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wide">Dashboard</h3>
                  </div>

                  {mobileSubmenu === 'dashboard' ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => setMobileSubmenu(null)}
                        className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronDown className="h-4 w-4 mr-2 rotate-180" /> Back to Menu
                      </button>
                      {user.role === 'admin' ? (
                        <>
                          <Link
                            href="/dashboard/overview"
                            className="flex items-center px-6 py-2 text-sm hover:bg-accent transition-colors"
                            onClick={handleMobileLinkClick}
                          >
                            Overview
                          </Link>
                          <Link
                            href="/dashboard/products"
                            className="flex items-center px-6 py-2 text-sm hover:bg-accent transition-colors"
                            onClick={handleMobileLinkClick}
                          >
                            Products
                          </Link>
                          <Link
                            href="/dashboard/categories"
                            className="flex items-center px-6 py-2 text-sm hover:bg-accent transition-colors"
                            onClick={handleMobileLinkClick}
                          >
                            Categories
                          </Link>
                          <Link
                            href="/dashboard/users"
                            className="flex items-center px-6 py-2 text-sm hover:bg-accent transition-colors"
                            onClick={handleMobileLinkClick}
                          >
                            Users
                          </Link>
                          <Link
                            href="/dashboard/orders"
                            className="flex items-center px-6 py-2 text-sm hover:bg-accent transition-colors"
                            onClick={handleMobileLinkClick}
                          >
                            Orders
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/dashboard"
                            className="flex items-center px-6 py-2 text-sm hover:bg-accent transition-colors"
                            onClick={handleMobileLinkClick}
                          >
                            My Dashboard
                          </Link>
                          <Link
                            href="/dashboard/orders"
                            className="flex items-center px-6 py-2 text-sm hover:bg-accent transition-colors"
                            onClick={handleMobileLinkClick}
                          >
                            My Orders
                          </Link>
                          <Link
                            href="/dashboard/favorites"
                            className="flex items-center px-6 py-2 text-sm hover:bg-accent transition-colors"
                            onClick={handleMobileLinkClick}
                          >
                            Favorites
                          </Link>
                        </>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setMobileSubmenu('dashboard')}
                      className="flex items-center justify-between w-full px-4 py-2 text-base font-medium hover:bg-accent transition-colors"
                    >
                      <span>Dashboard</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Bottom Buttons */}
              <div className="border-t pt-4 px-4">
                {user ? (
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" className="block" onClick={handleMobileLinkClick}>
                      <ShinyButton className="w-full">
                        Login
                      </ShinyButton>
                    </Link>
                    <Link href="/signup" className="block" onClick={handleMobileLinkClick}>
                      <ShinyButton variant="outline" className="w-full">
                        Sign Up
                      </ShinyButton>
                    </Link>
                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                      </div>
                    </div>
                    <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="w-full">
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

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={confirmLogout}
        isLoading={isLoggingOut}
      />

      {/* Cool Animated Search Modal */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -100, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[500px] lg:w-[600px] bg-background rounded-2xl shadow-2xl border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Search className="h-5 w-5 text-primary" />
                </motion.div>
                <h2 className="text-xl font-bold">Search Products</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileSearchOpen(false)}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Search Form */}
            <div className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative"
                >
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    autoFocus
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 h-14 text-lg rounded-xl border-2 focus:border-primary transition-all"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base rounded-xl font-semibold"
                    disabled={!searchQuery.trim()}
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Search Now
                  </Button>
                </motion.div>
              </form>

              {/* Popular Searches (Optional) */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {['3D Prints', 'Miniatures', 'Art', 'Sculptures'].map((term, index) => (
                    <motion.button
                      key={term}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearch({ preventDefault: () => {} });
                      }}
                      className="px-4 py-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
                    >
                      {term}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
