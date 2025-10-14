"use client";

import { Suspense, useState } from 'react';
import { UsersSearch } from '@/components/admin/UsersSearch';
import { UsersGrid } from '@/components/admin/UsersGrid';
import AnimatedLoader from '@/components/ui/AnimatedLoader/AnimatedLoader';

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage your customer accounts and track their activity
        </p>
      </div>

      {/* Search Component */}
      <UsersSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Users Grid */}
      <Suspense fallback={<AnimatedLoader />}>
        <UsersGrid searchTerm={searchTerm} />
      </Suspense>
    </div>
  );
}