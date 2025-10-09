// app/api/upload-image/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('images');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Allow WebP images too
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024;
    const uploadedUrls = [];

    for (const file of files) {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: `Invalid file type: ${file.type}. Allowed: PNG, JPG, GIF, WebP` 
        }, { status: 400 });
      }

      // Validate file size
      if (file.size > maxSize) {
        return NextResponse.json({ 
          error: `File too large: ${file.name}. Max size: 10MB` 
        }, { status: 400 });
      }

      // Convert file to base64 for ImgBB
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = buffer.toString('base64');

      // Upload to ImgBB using axios
      const imgbbFormData = new FormData();
      imgbbFormData.append('image', base64Image);

      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
        method: 'POST',
        body: imgbbFormData,
      });

      const imgbbData = await imgbbResponse.json();

      if (!imgbbData.success) {
        throw new Error(imgbbData.error?.message || 'ImgBB upload failed');
      }

      // Store the image URL
      uploadedUrls.push(imgbbData.data.url);
    }

    return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
    
  } catch (error) {
    console.error('ImgBB upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}