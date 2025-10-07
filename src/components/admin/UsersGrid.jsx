// src/components/admin/UsersGrid.jsx

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, Package } from 'lucide-react';

export function UsersGrid({ users }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredUsers.map((user) => (
        <Card key={user.id}>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-primary">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{user.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                  <Mail className="h-3 w-3" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Joined</span>
                </div>
                <span>{user.joinDate}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Package className="h-3 w-3" />
                  <span>Orders</span>
                </div>
                <span>{user.orders}</span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                {user.status}
              </Badge>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}