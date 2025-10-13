"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { useSyncedUser } from '@/lib/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import LogoutConfirmationModal from '@/components/modals/LogoutConfirmationModal';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Users, 
  ShoppingCart, 
  LogOut, 
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

function SidebarContent({ onItemClick }) {
  const pathname = usePathname();
  const { user } = useSyncedUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const getUserInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Logo */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-foreground">DimenShop</h2>
        <p className="text-sm text-muted-foreground">
          {user?.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {(user?.role === 'admin' ? adminSidebarItems : userSidebarItems).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <motion.div key={item.href} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={item.href}
                onClick={onItemClick}
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

      {/* User Section */}
      <div className="p-4 border-t">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start h-auto p-2">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name} />
                    )}
                    <AvatarFallback className="text-xs">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground truncate max-w-32">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogoutClick}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="text-xs text-muted-foreground">Not logged in</div>
        )}
      </div>
      
      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </div>
  );
}

export default function AdminSidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:bg-background md:border-r md:fixed md:h-full">
      <SidebarContent onItemClick={() => {}} />
    </aside>
  );
}