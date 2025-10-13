import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, email, phone, address, image } = await request.json();

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required and must be a valid string' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    console.log('Updating profile for user:', session.user.email);
    console.log('Update data:', { 
      name: name.trim(), 
      email: email.trim(), 
      phone: phone || 'not provided', 
      address: address || 'not provided', 
      hasImage: !!image 
    });

    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    const users = db.collection('users');

    // First, find the user by email to get the correct ID
    const currentUser = await users.findOne({ email: session.user.email });
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    console.log('Found user ID:', currentUser._id);

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await users.findOne({ 
        email, 
        _id: { $ne: currentUser._id } 
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 400 }
        );
      }
    }

    const updateData = { 
      name: name.trim(), 
      email: email.trim(),
      updatedAt: new Date()
    };

    // Handle optional fields - add them if provided, or remove if empty
    if (phone !== undefined) {
      if (phone && phone.trim()) {
        updateData.phone = phone.trim();
      } else {
        updateData.phone = null; // or you could use $unset instead
      }
    }
    
    if (address !== undefined) {
      if (address && address.trim()) {
        updateData.address = address.trim();
      } else {
        updateData.address = null;
      }
    }
    
    if (image !== undefined) {
      updateData.image = image || null;
    }

    // Use updateOne and then fetch the updated user
    const updateResult = await users.updateOne(
      { _id: currentUser._id },
      { $set: updateData }
    );

    console.log('Update result:', updateResult); // Debug log

    if (updateResult.matchedCount === 0) {
      console.log('No user matched for update');
      return NextResponse.json(
        { error: 'User not found for update' },
        { status: 404 }
      );
    }

    if (updateResult.modifiedCount === 0) {
      console.log('No changes made to user');
    }

    // Fetch the updated user
    const updatedUser = await users.findOne({ _id: currentUser._id });

    if (!updatedUser) {
      console.log('Could not fetch updated user');
      return NextResponse.json(
        { error: 'Failed to fetch updated user' },
        { status: 500 }
      );
    }

    const responseData = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || null,
      address: updatedUser.address || null,
      role: updatedUser.role,
      image: updatedUser.image || null,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    console.log('Returning user data:', responseData);

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Profile update error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}

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

    // Find user by email instead of ID to avoid ObjectId issues
    const user = await users.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      image: user.image,
      createdAt: user.createdAt,
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}