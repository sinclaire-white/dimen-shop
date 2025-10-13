// src/app/api/user/orders/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// PUT - Update order (cancel order)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    
    // Get the order first
    const order = await db.collection('orders').findOne({
      _id: new ObjectId(id),
      userEmail: session.user.email
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Only allow cancellation if order is pending or confirmed
    if (status === 'cancelled' && !['pending', 'confirmed'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Can only cancel pending or confirmed orders' },
        { status: 400 }
      );
    }

    // Update order status
    await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        } 
      }
    );

    // If cancelling, restore product stock
    if (status === 'cancelled') {
      for (const item of order.items) {
        await db.collection('products').updateOne(
          { _id: item.productId },
          { 
            $inc: { 
              stock: item.quantity,
              buyCount: -item.quantity
            } 
          }
        );
      }
    }

    return NextResponse.json({
      message: `Order ${status} successfully`
    });

  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}