// src/components/admin/UsersGrid.jsx

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, Package, Users as UsersIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminStore } from '@/lib/store';

export function UsersGrid({ searchTerm = '' }) {
  const { users, fetchUsers } = useAdminStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = (users || []).filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (users.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No users found</h3>
          <p className="text-muted-foreground">
            There are no registered users in the system yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (filteredUsers.length === 0 && searchTerm) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No users found</h3>
          <p className="text-muted-foreground">
            No users match your search criteria. Try adjusting your search terms.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredUsers.map((user) => (
        <Card key={user._id} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                {user.image ? (
                  <img 
                    src={user.image} 
                    alt={user.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-medium text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{user.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{user.email}</span>
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

              {user.phone && (
                <div className="flex justify-between text-sm">
                  <span>Phone</span>
                  <span className="truncate">{user.phone}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex gap-2">
                <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                  {user.status}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
              </div>
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