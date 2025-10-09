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
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import axios from 'axios';

export function ProductForm({ categories, fileFormats, printMaterials }) {
  const router = useRouter();
  const { addProduct } = useAdminStore();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // Handle image uploads with ImgBB
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    // Allow WebP images too
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
      // Create previews first
      const newPreviews = validFiles.map(file => ({
        url: '', // Will be filled after upload
        preview: URL.createObjectURL(file),
      }));

      // Add previews immediately for better UX
      setPreviewImages(prev => [...prev, ...newPreviews].slice(0, 5));

      const formData = new FormData();
      validFiles.forEach(file => formData.append('images', file));

      // Use axios for the upload
      const response = await axios.post('/api/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          // Optional: Add progress indicator if needed
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          console.log(`Upload Progress: ${progress}%`);
        }
      });

      // Update the URLs in the previews
      setPreviewImages(prev => 
        prev.map((img, index) => {
          // Find the index of the first image without a URL (newly uploaded)
          const uploadedIndex = prev.findIndex(item => item.url === '');
          if (index === uploadedIndex) {
            // Use the corresponding URL from the response
            const urlIndex = index - (prev.length - response.data.urls.length);
            return { ...img, url: response.data.urls[urlIndex] };
          }
          return img;
        })
      );

      toast.success('Images uploaded successfully!');
    } catch (error) {
      console.error('Image upload error:', error);
      // Remove the failed uploads from preview
      setPreviewImages(prev => prev.filter(img => img.url !== ''));
      toast.error(`Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Remove an image preview and URL by index
  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (uploading) {
      toast.error('Please wait for images to finish uploading');
      return;
    }

    setIsLoading(true);
    try {
      await addProduct({
        ...data,
        images: previewImages.map(img => img.url),
      });
      toast.success('Product added successfully!');
      router.push('/dashboard/products');
    } catch (error) {
      toast.error('Failed to add product');
      console.error('Product add error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up temporary preview URLs
  useEffect(() => {
    return () => previewImages.forEach(img => URL.revokeObjectURL(img.preview));
  }, [previewImages]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto">
      <div className="rounded-lg border bg-card dark:bg-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-foreground">Add New Product</h3>
        <div className="space-y-6">
          {/* Basic Information Section - keep your existing form fields */}
          <div className="space-y-4">
            {/* Your existing form fields remain the same */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground dark:text-foreground">Product Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Cyberpunk Character Model"
                className={cn(errors.name && 'border-destructive')}
                {...register('name', { required: 'Product name is required' })}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground dark:text-foreground">Description</Label>
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
                <Label htmlFor="price" className="text-foreground dark:text-foreground">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="49.99"
                  className={cn(errors.price && 'border-destructive')}
                  {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be positive' } })}
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-foreground dark:text-foreground">Category *</Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger className={cn(errors.category && 'border-destructive')}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">Category is required</p>}
              </div>
            </div>
          </div>

          {/* Specifications Section - keep your existing form fields */}
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fileFormat" className="text-foreground dark:text-foreground">File Format *</Label>
                <Select onValueChange={(value) => setValue('fileFormat', value)}>
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
                <Label htmlFor="printMaterial" className="text-foreground dark:text-foreground">Recommended Material</Label>
                <Select onValueChange={(value) => setValue('printMaterial', value)}>
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
                <Label htmlFor="dimensions" className="text-foreground dark:text-foreground">Dimensions (mm)</Label>
                <Input id="dimensions" placeholder="200x150x100" {...register('dimensions')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="printTime" className="text-foreground dark:text-foreground">Estimated Print Time</Label>
                <Input id="printTime" placeholder="8 hours" {...register('printTime')} />
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label className="text-foreground dark:text-foreground">Product Images</Label>
            
            <Label htmlFor="images" className="cursor-pointer">
              <div className="border-2 border-dashed border-muted dark:border-muted rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground dark:text-muted-foreground mb-2" />
                <div className="text-sm text-primary dark:text-primary hover:underline">
                  {uploading ? 'Uploading...' : 'Upload images'}
                </div>
                <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">
                  PNG, JPG, GIF, WebP up to 10MB
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
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 text-xs"
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
          {isLoading ? 'Adding...' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}