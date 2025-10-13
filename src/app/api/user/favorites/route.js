import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// GET - Fetch user's favorites
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    const users = db.collection('users');
    const products = db.collection('products');
    const categories = db.collection('categories');

    const user = await users.findOne(
      { email: session.user.email },
      { projection: { favorites: 1 } }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If user has no favorites, return empty array
    if (!user.favorites || user.favorites.length === 0) {
      return NextResponse.json({ favorites: [] });
    }

    // Get favorite products with category information
    const favoriteProducts = await products.aggregate([
      {
        $match: {
          _id: { $in: user.favorites.map(id => new ObjectId(id)) }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();

    return NextResponse.json({
      favorites: favoriteProducts
    });

  } catch (error) {
    console.error('Favorites fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add product to favorites
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    const users = db.collection('users');

    const user = await users.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if product is already in favorites
    const favorites = user.favorites || [];
    if (favorites.some(id => id.toString() === productId)) {
      return NextResponse.json(
        { error: 'Product already in favorites' },
        { status: 400 }
      );
    }

    // Add product to favorites
    await users.updateOne(
      { email: session.user.email },
      { $addToSet: { favorites: new ObjectId(productId) } }
    );

    return NextResponse.json({
      message: 'Product added to favorites'
    });

  } catch (error) {
    console.error('Add to favorites error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove product from favorites
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    const users = db.collection('users');

    const user = await users.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove product from favorites
    await users.updateOne(
      { email: session.user.email },
      { $pull: { favorites: new ObjectId(productId) } }
    );

    return NextResponse.json({
      message: 'Product removed from favorites'
    });

  } catch (error) {
    console.error('Remove from favorites error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}