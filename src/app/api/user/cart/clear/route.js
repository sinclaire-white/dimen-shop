// src/app/api/user/cart/clear/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';

// DELETE - Clear entire cart
export async function DELETE() {
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

    // Clear user's cart
    await db.collection('users').updateOne(
      { email: session.user.email },
      { $set: { cart: [] } }
    );

    return NextResponse.json({
      message: 'Cart cleared'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}