import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow admin users to access this endpoint
    if (!session?.user?.email || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    const users = db.collection('users');

    // Get all users (excluding sensitive information)
    const allUsers = await users.find({}, {
      projection: {
        hashedPassword: 0, // Exclude password hash
        password: 0, // Exclude any password field
        _id: 1,
        name: 1,
        email: 1,
        role: 1,
        image: 1,
        phone: 1,
        address: 1,
        favorites: 1,
        createdAt: 1,
        updatedAt: 1
      }
    }).sort({ createdAt: -1 }).toArray();

    // Format the data for display
    const formattedUsers = allUsers.map(user => ({
      _id: user._id,
      name: user.name || 'Unknown User',
      email: user.email,
      role: user.role || 'user',
      image: user.image,
      phone: user.phone,
      address: user.address,
      favoritesCount: user.favorites ? user.favorites.length : 0,
      joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
      status: 'Active', // You can implement user status logic later
      orders: 0 // TODO: Implement order counting from orders collection
    }));

    return NextResponse.json({
      users: formattedUsers,
      total: formattedUsers.length
    });

  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}