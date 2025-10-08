// /app/api/categories/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';


export async function GET() {
  try {
    const { collection } = await dbConnect('categories');
    const categories = await collection.find({}).toArray();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, description } = await request.json();
    const { collection } = await dbConnect('categories');
    const result = await collection.insertOne({
      name,
      description,
      createdAt: new Date().toISOString(),
    });
    const newCategory = { id: result.insertedId, ...request.body };
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Add category error:', error);
    return NextResponse.json({ error: 'Failed to add' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const { collection } = await dbConnect('categories');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Category deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, name, description } = await request.json();
    const { collection } = await dbConnect('categories');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, description, updatedAt: new Date().toISOString() } }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    const updatedCategory = await collection.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ...updatedCategory, id: updatedCategory._id.toString() }, { status: 200 });
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}