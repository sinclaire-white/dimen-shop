// src/app/api/user/cart/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch user's cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    
    // Get user's cart with populated product details
    const user = await db.collection('users').findOne({
      email: session.user.email
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get cart items with product details
    if (!user.cart || user.cart.length === 0) {
      return NextResponse.json({ cart: [] });
    }

    // Get product IDs from cart
    const productIds = user.cart.map(item => {
      try {
        return new ObjectId(item.productId);
      } catch (error) {
        console.error('Invalid product ID:', item.productId);
        return null;
      }
    }).filter(id => id !== null);

    if (productIds.length === 0) {
      return NextResponse.json({ cart: [] });
    }

    // Get products with category details
    const products = await db.collection('products').aggregate([
      {
        $match: {
          _id: { $in: productIds }
        }
      },
      {
        $addFields: {
          categoryObjectId: { 
            $cond: {
              if: { $type: "$category" },
              then: { $toObjectId: "$category" },
              else: null
            }
          }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryObjectId',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $addFields: {
          category: {
            $cond: {
              if: { $gt: [{ $size: "$categoryInfo" }, 0] },
              then: { $arrayElemAt: ["$categoryInfo", 0] },
              else: { _id: "$category", name: "Unknown Category" }
            }
          }
        }
      },
      {
        $project: {
          categoryObjectId: 0,
          categoryInfo: 0
        }
      }
    ]).toArray();

    // Combine cart items with product details
    const cartWithProducts = user.cart.map(cartItem => {
      const product = products.find(p => p._id.toString() === cartItem.productId);
      if (!product) {
        return null;
      }
      
      return {
        product: {
          ...product,
          _id: product._id.toString(),
          category: product.category ? {
            ...product.category,
            _id: product.category._id?.toString() || product.category._id
          } : null
        },
        quantity: cartItem.quantity,
        addedAt: cartItem.addedAt
      };
    }).filter(item => item !== null);

    return NextResponse.json({
      cart: cartWithProducts
    });

  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add product to cart
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    
    // Verify product exists
    const product = await db.collection('products').findOne({
      _id: new ObjectId(productId)
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check stock
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Add or update cart item
    const result = await db.collection('users').updateOne(
      { 
        email: session.user.email,
        'cart.productId': productId
      },
      { 
        $inc: { 'cart.$.quantity': quantity } 
      }
    );

    if (result.matchedCount === 0) {
      // Product not in cart, add new item
      await db.collection('users').updateOne(
        { email: session.user.email },
        { 
          $addToSet: { 
            cart: {
              productId: productId,
              quantity: quantity,
              addedAt: new Date()
            }
          } 
        }
      );
    }

    return NextResponse.json({
      message: 'Product added to cart'
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update cart item quantity
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();

    if (!productId || quantity < 0) {
      return NextResponse.json(
        { error: 'Valid product ID and quantity required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('dimenshopdb');

    if (quantity === 0) {
      // Remove item from cart
      await db.collection('users').updateOne(
        { email: session.user.email },
        { $pull: { cart: { productId: productId } } }
      );
    } else {
      // Update quantity
      await db.collection('users').updateOne(
        { 
          email: session.user.email,
          'cart.productId': productId
        },
        { 
          $set: { 'cart.$.quantity': quantity } 
        }
      );
    }

    return NextResponse.json({
      message: 'Cart updated'
    });

  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove product from cart
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json (
        { error: 'Authentication required' },
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

    // Remove product from cart
    await db.collection('users').updateOne(
      { email: session.user.email },
      { $pull: { cart: { productId: productId } } }
    );

    return NextResponse.json({
      message: 'Product removed from cart'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}