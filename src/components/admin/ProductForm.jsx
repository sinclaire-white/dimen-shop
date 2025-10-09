// components/admin/ProductForm.jsx - Updated version
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, X, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import axios from 'axios';

export function ProductForm({ categories, fileFormats, printMaterials, editData = null }) {
  const router = useRouter();
  const { addProduct, updateProduct } = useAdminStore();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState(editData?.images?.map(url => ({ url })) || []);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: editData ? {
      name: editData.name,
      description: editData.description,
      price: editData.price,
      category: editData.category,
      fileFormat: editData.fileFormat,
      printMaterial: editData.printMaterial,
      dimensions: editData.dimensions,
      printTime: editData.printTime,
      stock: editData.stock || 0,
      featured: editData.featured || false,
    } : {}
  });

  const stock = watch('stock', editData?.stock || 0);
  const featured = watch('featured', editData?.featured || false);

  // Handle image uploads (same as before, but updated for edit mode)
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024;
    const validFiles = files.filter(file => allowedTypes.includes(file.type) && file.size <= maxSize);

    if (validFiles.length !== files.length) {
      toast.error('Some files rejected: Only PNG, JPG, GIF, WebP up to 10MB');
      return;
    }
    if (validFiles.length + previewImages.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setUploading(true);

    try {
      const newPreviews = validFiles.map(file => ({
        url: '',
        preview: URL.createObjectURL(file),
      }));

      setPreviewImages(prev => [...prev, ...newPreviews].slice(0, 5));

      const formData = new FormData();
      validFiles.forEach(file => formData.append('images', file));

      const response = await axios.post('/api/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPreviewImages(prev => 
        prev.map((img, index) => {
          const uploadedIndex = prev.findIndex(item => item.url === '');
          if (index === uploadedIndex) {
            const urlIndex = index - (prev.length - response.data.urls.length);
            return { ...img, url: response.data.urls[urlIndex] };
          }
          return img;
        })
      );

      toast.success('Images uploaded successfully!');
    } catch (error) {
      console.error('Image upload error:', error);
      setPreviewImages(prev => prev.filter(img => img.url !== ''));
      toast.error(`Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const updateStock = (amount) => {
    const currentStock = parseInt(stock, 10) || 0;
    const newStock = Math.max(0, currentStock + amount);
    setValue('stock', newStock);
  };

  const onSubmit = async (data) => {
    if (uploading) {
      toast.error('Please wait for images to finish uploading');
      return;
    }

    if (previewImages.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        ...data,
        images: previewImages.map(img => img.url),
        stock: parseInt(data.stock),
        featured: data.featured || false,
      };

      if (editData) {
        await updateProduct({ ...productData, id: editData._id });
        toast.success('Product updated successfully!');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully!');
      }
      
      router.push('/dashboard/products');
    } catch (error) {
      toast.error(`Failed to ${editData ? 'update' : 'add'} product`);
      console.error('Product error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => previewImages.forEach(img => {
      if (img.preview) URL.revokeObjectURL(img.preview);
    });
  }, [previewImages]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">
          {editData ? 'Edit Product' : 'Add New Product'}
        </h3>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Cyberpunk Character Model"
                className={cn(errors.name && 'border-destructive')}
                {...register('name', { required: 'Product name is required' })}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your 3D model..."
                rows={4}
                className="resize-none"
                {...register('description')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="49.99"
                  className={cn(errors.price && 'border-destructive')}
                  {...register('price', { 
                    required: 'Price is required', 
                    min: { value: 0, message: 'Price must be positive' } 
                  })}
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  onValueChange={(value) => setValue('category', value)}
                  defaultValue={editData?.category}
                >
                  <SelectTrigger className={cn(errors.category && 'border-destructive')}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id || category.id} value={category._id || category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">Category is required</p>}
              </div>
            </div>
          </div>

          {/* Stock Management */}
          <div className="space-y-4">
            <h4 className="font-medium">Inventory Management</h4>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => updateStock(-1)}
                    disabled={stock <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    {...register('stock', { 
                      min: { value: 0, message: 'Stock cannot be negative' } 
                    })}
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => updateStock(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Product Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="featured"
                    checked={featured}
                    onCheckedChange={(checked) => setValue('featured', checked)}
                  />
                  <Label htmlFor="featured" className="text-sm font-normal cursor-pointer">
                    Mark as Featured
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Featured products appear on the homepage
                </p>
              </div>
            </div>
          </div>

          {/* Specifications Section */}
          <div className="space-y-4">
            <h4 className="font-medium">Product Specifications</h4>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fileFormat">File Format *</Label>
                <Select 
                  onValueChange={(value) => setValue('fileFormat', value)}
                  defaultValue={editData?.fileFormat}
                >
                  <SelectTrigger className={cn(errors.fileFormat && 'border-destructive')}>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileFormats.map((format) => (
                      <SelectItem key={format} value={format}>{format}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fileFormat && <p className="text-sm text-destructive">File format is required</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="printMaterial">Recommended Material</Label>
                <Select 
                  onValueChange={(value) => setValue('printMaterial', value)}
                  defaultValue={editData?.printMaterial}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {printMaterials.map((material) => (
                      <SelectItem key={material} value={material}>{material}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions (mm)</Label>
                <Input 
                  id="dimensions" 
                  placeholder="200x150x100" 
                  {...register('dimensions')}
                  defaultValue={editData?.dimensions}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="printTime">Estimated Print Time</Label>
                <Input 
                  id="printTime" 
                  placeholder="8 hours" 
                  {...register('printTime')}
                  defaultValue={editData?.printTime}
                />
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>Product Images *</Label>
            
            <Label htmlFor="images" className="cursor-pointer">
              <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                <div className="text-sm text-primary hover:underline">
                  {uploading ? 'Uploading...' : 'Upload images'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF, WebP up to 10MB (Max 5 images)
                </p>
              </div>
            </Label>
            
            <input
              id="images"
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview || image.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 text-xs flex items-center justify-center"
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {!image.url && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-md">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          type="button"
          onClick={() => router.push('/dashboard/products')}
          disabled={isLoading || uploading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1" 
          disabled={isLoading || uploading || previewImages.length === 0}
        >
          {isLoading 
            ? (editData ? 'Updating...' : 'Adding...') 
            : (editData ? 'Update Product' : 'Add Product')
          }
        </Button>
      </div>
    </form>
  );
}