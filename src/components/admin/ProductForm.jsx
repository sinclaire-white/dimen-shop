// components/admin/ProductForm.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminStore } from '@/lib/store';
import AnimatedLoader from '@/components/ui/AnimatedLoader/AnimatedLoader';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  category: z.string().min(1, 'Category is required'),
  stock: z.string().min(1, 'Stock is required'),
  dimensions: z.string().optional(),
  printTime: z.string().optional(),
  printMaterial: z.string().optional(),
  fileFormat: z.string().optional(),
  featured: z.boolean().optional(),
});

export function ProductForm({ editData = null }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(editData?.images || []);
  const [dragActive, setDragActive] = useState(false);

  // Use Zustand store
  const { 
    categories, 
    loading, 
    fetchCategories, 
    createProduct, 
    updateProduct 
  } = useAdminStore();

  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: editData ? {
      ...editData,
      price: editData.price?.toString(),
      stock: editData.stock?.toString(),
    } : {
      featured: false
    },
  });

  const watchedCategory = watch('category');
  const watchedFeatured = watch('featured');

  // Fetch categories using store
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Remove image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files) => {
    const fileList = Array.from(files);
    const validFiles = fileList.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== fileList.length) {
      toast.error("Only image files are allowed");
      return;
    }

    setUploading(true);
    try {
      const uploadedImages = [];
      
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('images', file);
        
        const response = await fetch('/api/upload-imgbb', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.urls && result.urls.length > 0) {
            uploadedImages.push(...result.urls);
          }
        }
      }
      
      setImages(prev => [...prev, ...uploadedImages]);
      toast.success("Images uploaded successfully");
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  // Form submission using store
  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      const productData = {
        ...data,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        images,
        featured: data.featured || false,
      };

      if (editData) {
        await updateProduct(editData._id, productData);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(productData);
        toast.success("Product created successfully!");
      }

      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error("Failed to save product");
    }
  };

  if (loading) return <AnimatedLoader />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editData ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input 
                id="name" 
                {...register('name')}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input 
                id="price" 
                type="number" 
                step="0.01" 
                {...register('price')}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={watchedCategory}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category.message}</p>
              )}
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input 
                id="stock" 
                type="number" 
                {...register('stock')}
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock.message}</p>
              )}
            </div>

            {/* Other fields remain the same... */}
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input 
                id="dimensions" 
                {...register('dimensions')}
                placeholder="e.g., 200x150x100mm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="printTime">Print Time</Label>
              <Input 
                id="printTime" 
                {...register('printTime')}
                placeholder="e.g., 12 hrs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="printMaterial">Print Material</Label>
              <Input 
                id="printMaterial" 
                {...register('printMaterial')}
                placeholder="e.g., PLA, ABS"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileFormat">File Format</Label>
              <Input 
                id="fileFormat" 
                {...register('fileFormat')}
                placeholder="e.g., STL, OBJ"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              rows={4} 
              {...register('description')}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          {/* Images Upload */}
          <div className="space-y-4">
            <Label htmlFor="images" className="text-base font-semibold">Product Images</Label>
            
            {/* Drag and Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-primary bg-primary/5 scale-[1.02]' 
                  : 'border-gray-300 hover:border-gray-400'
              } ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-50'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('images')?.click()}
            >
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                disabled={uploading}
              />
              
              <div className="flex flex-col items-center space-y-4">
                {uploading ? (
                  <>
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-700">Uploading images...</p>
                      <p className="text-sm text-gray-500">Please wait while we process your images</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`p-4 rounded-full transition-colors ${
                      dragActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Upload className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-700">
                        {dragActive ? 'Drop images here' : 'Upload product images'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Drag and drop your images here, or click to browse
                      </p>
                      <p className="text-xs text-gray-400">
                        Supports: JPG, PNG, GIF, WebP (Max 10MB each)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  Uploaded Images ({images.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <img 
                          src={img} 
                          alt={`Product image ${index + 1}`} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  💡 Tip: The first image will be used as the main product image
                </p>
              </div>
            )}
          </div>

          {/* Featured */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={watchedFeatured}
              onCheckedChange={(checked) => setValue('featured', checked)}
            />
            <Label htmlFor="featured">Featured Product</Label>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || uploading}
          >
            {loading ? 'Saving...' : editData ? 'Update Product' : 'Create Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}