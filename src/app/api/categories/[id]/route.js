// src/app/api/categories/[id]/route.js

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

// GET: Fetch a single category by ID with product count
export async function GET(request, { params }) {
  try {
    // Validate category ID
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid category ID format' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('dimenshopdb');

    // Fetch category
    const category = await db.collection('categories').findOne({
      _id: new ObjectId(id),
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Count products in this category (using 'category' field for consistency)
    const productCount = await db.collection('products').countDocuments({
      category: id, // Matches string ID used in products collection
    });

    // Return category with string _id and product count
    return NextResponse.json({
      ...category,
      _id: category._id.toString(),
      productCount,
    });
  } catch (error) {
    console.error('Fetch category error:', error);
    return NextResponse.json(
      { error: `Failed to fetch category: ${error.message}` },
      { status: 500 }
    );
  }
}