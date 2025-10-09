// app/api/products/route.js - Updated with featured and stock fields
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    
    const { collection } = await dbConnect('products');
    
    // Build query based on parameters
    let query = {};
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    
    const products = await collection.find(query).toArray();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST - Updated to include featured and stock
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { collection } = await dbConnect('products');
    
    const result = await collection.insertOne({
      ...data,
      featured: data.featured || false,
      stock: data.stock || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    const newProduct = { 
      id: result.insertedId.toString(), 
      ...data,
      featured: data.featured || false,
      stock: data.stock || 0
    };
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Add product error:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}