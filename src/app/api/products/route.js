// /app/api/products/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

// GET: Fetch all products from the 'products' collection in dimenshopdb
export async function GET() {
  try {
    // Connect to MongoDB and get the 'products' collection
    const { collection } = await dbConnect('products');
    // Retrieve all products as an array
    const products = await collection.find({}).toArray();
    // Return products as JSON response
    return NextResponse.json(products);
  } catch (error) {
    // Log and return error if fetching fails
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST: Add a new product (admin-only)
export async function POST(request) {
  // Check if user is authenticated and has admin role
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse request body for product data
    const data = await request.json();
    // Connect to MongoDB and get the 'products' collection
    const { collection } = await dbConnect('products');
    // Insert new product with timestamps
    const result = await collection.insertOne({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    // Create response object with inserted ID as string
    const newProduct = { id: result.insertedId.toString(), ...data };
    // Return created product with 201 status
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    // Log and return error if insertion fails
    console.error('Add product error:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

// PUT: Update an existing product (admin-only)
export async function PUT(request) {
  // Check if user is authenticated and has admin role
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse request body for product ID and update data
    const { id, ...updateData } = await request.json();
    // Connect to MongoDB and get the 'products' collection
    const { collection } = await dbConnect('products');
    // Update product by ID with new data and timestamp
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date().toISOString() } }
    );
    // Check if product was found
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    // Fetch and return updated product
    const updatedProduct = await collection.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ...updatedProduct, id: updatedProduct._id.toString() }, { status: 200 });
  } catch (error) {
    // Log and return error if update fails
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE: Remove a product by ID (admin-only)
export async function DELETE(request) {
  // Check if user is authenticated and has admin role
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse request body for product ID
    const { id } = await request.json();
    // Connect to MongoDB and get the 'products' collection
    const { collection } = await dbConnect('products');
    // Delete product by ID
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    // Check if product was found
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    // Return success message
    return NextResponse.json({ message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    // Log and return error if deletion fails
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}