// src/app/dashboard/users/page.js

import { UsersSearch } from '@/components/admin/UsersSearch';
import { UsersGrid } from '@/components/admin/UsersGrid';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2024-01-01', orders: 12, status: 'Active' },
  { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', joinDate: '2024-01-05', orders: 8, status: 'Active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joinDate: '2024-01-10', orders: 3, status: 'Inactive' },
  { id: 4, name: 'Lisa Brown', email: 'lisa@example.com', joinDate: '2024-01-12', orders: 15, status: 'Active' },
];

export default function Users() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header - Static content stays in page.js */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage your customer accounts and track their activity
        </p>
      </div>

      {/* Search Component - Client-side interactive part */}
      <UsersSearch />

      {/* Users Grid - Client-side interactive part */}
      <UsersGrid users={mockUsers} />
    </div>
  );
}