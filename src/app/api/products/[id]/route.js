import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { fileFormats, printMaterials } from '@/lib/constants';

// Validation schema for PUT request
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Product name too long').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  category: z.string().min(1, 'Category ID is required').optional(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  fileFormat: z.enum(fileFormats, { errorMap: () => ({ message: `File format must be one of: ${fileFormats.join(', ')}` }) }).optional(),
  printMaterial: z.enum(printMaterials, { errorMap: () => ({ message: `Print material must be one of: ${printMaterials.join(', ')}` }) }).optional(),
  featured: z.boolean().optional(),
  stock: z.number().int().min(0, 'Stock must be a non-negative integer').optional(),
});

// GET: Fetch a single product by ID
export async function GET(request, { params }) {
  try {
    // Validate product ID
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    const collection = db.collection('products');

    // Fetch product
    const product = await collection.findOne({ _id: new ObjectId(id) });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Return product with string _id
    return NextResponse.json({
      ...product,
      _id: product._id.toString(),
    });
  } catch (error) {
    console.error('Fetch product error:', error);
    return NextResponse.json({ error: `Failed to fetch product: ${error.message}` }, { status: 500 });
  }
}

// DELETE: Remove a product by ID (admin only)
export async function DELETE(request, { params }) {
  // Check for admin authentication
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Validate product ID
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    const collection = db.collection('products');

    // Delete product
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: `Failed to delete product: ${error.message}` }, { status: 500 });
  }
}

// PUT: Update a product by ID (admin only)
export async function PUT(request, { params }) {
  // Check for admin authentication
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Validate product ID
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    const collection = db.collection('products');

    // Verify category exists if provided
    if (validatedData.category) {
      const categoryExists = await db.collection('categories').findOne({ _id: validatedData.category });
      if (!categoryExists) {
        return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
      }
    }

    // Update product
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...validatedData, updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Fetch updated product
    const updatedProduct = await collection.findOne({ _id: new ObjectId(id) });
    return NextResponse.json(
      { ...updatedProduct, _id: updatedProduct._id.toString() },
      { status: 200 }
    );
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Update product error:', error);
    return NextResponse.json({ error: `Failed to update product: ${error.message}` }, { status: 500 });
  }
}