"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, LogOut } from 'lucide-react';

export default function LogoutConfirmationModal({ isOpen, onClose, onConfirm, isLoading = false }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle>Confirm Logout</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            Are you sure you want to log out? You will need to sign in again to access your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            {isLoading ? 'Logging out...' : 'Yes, Logout'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}