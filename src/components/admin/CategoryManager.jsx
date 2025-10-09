'use client';

import { useEffect, useState } from 'react';
import { useAdminStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Form component extracted to keep client-side logic separate
function CategoryForm({ formData, setFormData, editMode, handleSubmit, setOpen, setEditMode }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <DialogHeader>
        <DialogTitle>{editMode ? 'Edit Category' : 'Add New Category'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <Button type="submit" className="w-full">{editMode ? 'Save' : 'Add'}</Button>
      </form>
    </motion.div>
  );
}

export function CategoryManager() {
  const { categories, fetchCategories, addCategory, deleteCategory, updateCategory } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', description: '' });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      updateCategory(formData);
      toast.success('Category updated!');
    } else {
      addCategory({ name: formData.name, description: formData.description });
      toast.success('Category added!');
    }
    setOpen(false);
    setFormData({ id: '', name: '', description: '' });
    setEditMode(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
      toast.success('Category deleted!');
    }
  };

  const handleEdit = (category) => {
    setFormData({ id: category.id, name: category.name, description: category.description });
    setEditMode(true);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Categories</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {editMode ? 'Edit Category' : 'Add Category'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CategoryForm
              formData={formData}
              setFormData={setFormData}
              editMode={editMode}
              handleSubmit={handleSubmit}
              setOpen={setOpen}
              setEditMode={setEditMode}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category._id}
                className="border rounded-lg p-4 bg-background hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(category)} className="text-blue-500 hover:text-blue-700">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(category.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}