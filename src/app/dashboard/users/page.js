// src/app/dashboard/users/page.js

import { UsersSearch } from '@/components/admin/UsersSearch';
import { UsersGrid } from '@/components/admin/UsersGrid';



export default function Users() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Page Header - Static content stays in page.js */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage your customer accounts and track their activity
        </p>
      </div>

      {/* Search Component - Client-side interactive part */}
      <UsersSearch />

      {/* Users Grid - Client-side interactive part */}
      <UsersGrid  />
    </div>
  );
}