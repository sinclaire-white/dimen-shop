// src/app/api/categories/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

// Validation schema for POST and PUT requests
const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name too long'),
  description: z.string().max(500, 'Description too long').optional(),
});

// GET: Fetch all categories with optional pagination
export async function GET(request) {
  try {
    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    const collection = db.collection('categories');

    // Fetch categories with product count using aggregation
    const categories = await collection.aggregate([
      {
        $addFields: {
          categoryIdString: { $toString: '$_id' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'categoryIdString',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $addFields: {
          productCount: { $size: '$products' }
        }
      },
      {
        $project: {
          products: 0, // Exclude the products array from the final output
          categoryIdString: 0 // Exclude the temporary field
        }
      },
      { $sort: { name: 1 } }, // Sort by name
      { $skip: skip },
      { $limit: limit }
    ]).toArray();

    // Convert _id to string for client compatibility
    const formattedCategories = categories.map(category => ({
      ...category,
      _id: category._id.toString(),
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST: Create a new category (admin only)
export async function POST(request) {
  // Check for admin authentication
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse and validate request body
    const body = await request.json();
    const { name, description } = categorySchema.parse(body);

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    const collection = db.collection('categories');

    // Check for duplicate category name
    const existingCategory = await collection.findOne({ name });
    if (existingCategory) {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 409 });
    }

    // Insert new category
    const result = await collection.insertOne({
      name,
      description,
      createdAt: new Date().toISOString(),
    });

    // Prepare response with string _id
    const newCategory = {
      _id: result.insertedId.toString(),
      name,
      description,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Add category error:', error);
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
  }
}

// DELETE: Remove a category by ID (admin only)
export async function DELETE(request) {
  // Check for admin authentication
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse and validate ID
    const { id } = await request.json();
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    const collection = db.collection('categories');

    // Check for products in this category
    const productCount = await db.collection('products').countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with associated products' },
        { status: 400 }
      );
    }

    // Delete the category
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

// PUT: Update a category by ID (admin only)
export async function PUT(request) {
  // Check for admin authentication
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse and validate request body
    const { id, name, description } = await request.json();
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }
    const validatedData = categorySchema.parse({ name, description });

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    const collection = db.collection('categories');

    // Check for duplicate category name (excluding current category)
    const existingCategory = await collection.findOne({ name, _id: { $ne: new ObjectId(id) } });
    if (existingCategory) {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 409 });
    }

    // Update the category
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, description, updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Fetch updated category
    const updatedCategory = await collection.findOne({ _id: new ObjectId(id) });
    return NextResponse.json(
      { ...updatedCategory, _id: updatedCategory._id.toString() },
      { status: 200 }
    );
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Update category error:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}