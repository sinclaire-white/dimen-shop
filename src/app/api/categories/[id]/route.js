// app/api/categories/[id]/route.js
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/dbConnect';

export async function GET(request, { params }) {
  let client;
  
  try {
    if (!params?.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const { client: dbClient } = await dbConnect('categories');
    client = dbClient;
    const db = client.db();

    // Get category and its products count
    const category = await db.collection('categories').findOne({
      _id: new ObjectId(params.id)
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Count products in this category
    const productCount = await db.collection('products').countDocuments({
      categoryId: new ObjectId(params.id)
    });

    return NextResponse.json({
      ...category,
      _id: category._id.toString(),
      productCount
    });

  } catch (error) {
    console.error('Fetch category error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}