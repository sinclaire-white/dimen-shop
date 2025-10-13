// src/app/api/admin/orders/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';

// GET - Fetch all orders (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    
    const user = await db.collection('users').findOne({
      email: session.user.email
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all orders with populated product details
    const orders = await db.collection('orders').aggregate([
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
    console.error('Admin orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}