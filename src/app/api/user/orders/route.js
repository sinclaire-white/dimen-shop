// src/app/api/user/orders/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch user's orders
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
    
    // Get user's orders with populated product details
    const orders = await db.collection('orders').aggregate([
      {
        $match: {
          userEmail: session.user.email
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $addFields: {
          items: {
            $map: {
              input: '$items',
              as: 'item',
              in: {
                $mergeObjects: [
                  '$$item',
                  {
                    product: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$productDetails',
                            cond: { $eq: ['$$this._id', '$$item.productId'] }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $project: {
          productDetails: 0
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]).toArray();

    return NextResponse.json({
      orders: orders
    });

  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { items, shippingAddress, paymentMethod = 'cod' } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    
    // Get user details
    const user = await db.collection('users').findOne({
      email: session.user.email
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate products and calculate total
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await db.collection('products').findOne({
        _id: new ObjectId(item.productId)
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        productId: new ObjectId(item.productId),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Create order
    const order = {
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userEmail: session.user.email,
      userName: user.name,
      items: validatedItems,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('orders').insertOne(order);

    // Update product stock
    for (const item of validatedItems) {
      await db.collection('products').updateOne(
        { _id: item.productId },
        { 
          $inc: { 
            stock: -item.quantity,
            buyCount: item.quantity
          } 
        }
      );
    }

    // Clear user's cart
    await db.collection('users').updateOne(
      { email: session.user.email },
      { $set: { cart: [] } }
    );

    return NextResponse.json({
      message: 'Order created successfully',
      orderId: result.insertedId,
      orderNumber: order.orderNumber
    });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}