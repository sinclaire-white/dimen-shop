// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
    const maxSize = 10 * 1024 * 1024;
    const uploadedUrls = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 });
      }
      if (file.size > maxSize) {
        return NextResponse.json({ error: `File too large: ${file.name}` }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'dimenshop/products',
            resource_type: 'image',
            format: 'webp',
            quality: 'auto:good',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      uploadedUrls.push(result.secure_url);
    }

    return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
    
  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}