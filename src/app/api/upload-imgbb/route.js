import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import axios from 'axios';
import { z } from 'zod';

// Validation schema for uploaded files
const fileSchema = z.object({
  files: z
    .array(
      z.object({
        type: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'], {
          errorMap: () => ({ message: 'File type must be PNG, JPG, GIF, or WebP' }),
        }),
        size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
      })
    )
    .min(1, 'At least one file is required'),
});

// Retry helper for ImgBB uploads
async function uploadToImgBB(file, retries = 3, delay = 1000) {
  const formData = new FormData();
  formData.append('image', file);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'ImgBB upload failed');
      }

      // Use display_url for the full-size direct image URL
      return response.data.data.display_url;
    } catch (error) {
      if (attempt === retries) {
        throw new Error(`ImgBB upload failed after ${retries} attempts: ${error.message}`);
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// POST: Upload images to ImgBB (authenticated users only)
export async function POST(request) {
  // Check for authentication (any logged-in user can upload)
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
  }

  try {
    // Parse form data
    const formData = await request.formData();
    
    // Support both 'image' (single) and 'images' (multiple) field names
    let files = formData.getAll('images');
    if (files.length === 0) {
      const singleFile = formData.get('image');
      if (singleFile) {
        files = [singleFile];
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Validate files
    const fileData = files.map(file => ({
      type: file.type,
      size: file.size,
    }));
    fileSchema.parse({ files: fileData });

    const uploadedUrls = [];

    // Upload each file to ImgBB with retry logic
    for (const file of files) {
      // Convert file to base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = buffer.toString('base64');

      // Upload to ImgBB
      const url = await uploadToImgBB(base64Image);
      uploadedUrls.push(url);
    }

    // Return single URL if only one file, array if multiple
    if (uploadedUrls.length === 1) {
      return NextResponse.json({ url: uploadedUrls[0], urls: uploadedUrls }, { status: 200 });
    }
    
    // Return uploaded image URLs
    return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    // Handle other errors
    console.error('ImgBB upload error:', error);
    return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
  }
}