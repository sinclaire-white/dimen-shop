// app/api/signup/route.js: Manual user creation with Zod validation 
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';  // Zod for schema validation
import clientPromise from '@/lib/mongodb';  // Our DB connection

// Zod schema: Defines/validates input shape (required fields, formats, lengths)
const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// POST handler: Processes sign-up form data
export async function POST(request) {
  try {
    // Parse JSON body from form
    const body = await request.json();
    // Validate with Zod (throws ZodError on failure)
    const { name, email, password } = signUpSchema.parse(body);

    // Connect to DB
    const client = await clientPromise;
    const db = client.db('dimenshopdb');  // Our e-commerce database

    // Security: Prevent duplicate emails
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
    }

    // Hash password for secure storage (bcrypt with salt rounds=12)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user with defaults (role='user' for all new sign-ups)
    const newUser = await db.collection('users').insertOne({
      email,
      hashedPassword,
      name: name.trim(),  // Single full name, trimmed
      role: 'user',  // Default; manually update to 'admin' in DB if needed
      createdAt: new Date(),  // Timestamp for auditing
    });

    // Return success with inserted ID
    return NextResponse.json({ success: true, userId: newUser.insertedId });
  } catch (error) {
    // Handle Zod validation errors specifically
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    // Log for debugging; return generic error to user
    console.error('Sign-up error:', error);
    return NextResponse.json({ error: 'Server error during sign-up.' }, { status: 500 });
  }
}