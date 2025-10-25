// src/components/admin/UsersGrid.jsx

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, Package, Users as UsersIcon, X, MapPin, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';

export function UsersGrid({ searchTerm = '' }) {
  const { users, loading, fetchUsers } = useAdminStore();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = (users || []).filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedUser(null), 200);
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

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
              <Button variant="outline" size="sm" onClick={() => handleViewDetails(user)}>
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* User Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about this user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Header */}
              <div className="flex items-center space-x-4 pb-4 border-b">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  {selectedUser.image ? (
                    <img 
                      src={selectedUser.image} 
                      alt={selectedUser.name} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-medium text-primary">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={selectedUser.status === 'Active' ? 'default' : 'secondary'}>
                      {selectedUser.status}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {selectedUser.role}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">Contact Information</h4>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    </div>
                  </div>

                  {selectedUser.phone && (
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
                      </div>
                    </div>
                  )}

                  {selectedUser.address && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">{selectedUser.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">Account Information</h4>
                  
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.createdAt 
                          ? format(new Date(selectedUser.createdAt), 'PPP')
                          : selectedUser.joinDate || 'N/A'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Total Orders</p>
                      <p className="text-sm text-muted-foreground">{selectedUser.orders || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">User ID</p>
                      <p className="text-sm text-muted-foreground font-mono">{selectedUser._id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedUser.bio && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase mb-2">Bio</h4>
                  <p className="text-sm">{selectedUser.bio}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}