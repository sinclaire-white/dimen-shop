// src/app/api/admin/orders/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// PUT - Update order status (admin only)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { status } = await request.json();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Valid order ID is required' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    
    // Check if user is admin
    const user = await db.collection('users').findOne({
      email: session.user.email
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Find the order
    const order = await db.collection('orders').findOne({
      _id: new ObjectId(id)
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Validate status transition
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Cannot update cancelled or delivered orders
    if (order.status === 'cancelled' || order.status === 'delivered') {
      return NextResponse.json(
        { error: 'Cannot update cancelled or delivered orders' },
        { status: 400 }
      );
    }

    // Update order status
    const updateData = {
      status: status,
      updatedAt: new Date()
    };

    // Add timestamp for specific status changes
    switch (status) {
      case 'confirmed':
        updateData.confirmedAt = new Date();
        break;
      case 'processing':
        updateData.processingAt = new Date();
        break;
      case 'shipped':
        updateData.shippedAt = new Date();
        break;
      case 'delivered':
        updateData.deliveredAt = new Date();
        break;
      case 'cancelled':
        updateData.cancelledAt = new Date();
        break;
    }

    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Order ${status} successfully`,
      orderId: id
    });

  } catch (error) {
    console.error('Admin order update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}