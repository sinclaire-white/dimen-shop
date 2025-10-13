
// src/components/admin/UsersSearch.jsx

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function UsersSearch({ searchTerm, onSearchChange }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardContent>
    </Card>
  );
}