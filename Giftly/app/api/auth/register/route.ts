import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { hashPassword, generateToken, isValidEmail, isValidPassword, rateLimit } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.ip || 'unknown';

    // Rate limiting
    if (!rateLimit(`register:${clientIp}`, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, message: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { firebaseUid, email, fullName,phoneNumber,role,storeName,storeDescription,password } = await request.json();
     

    // Validation
    if (!fullName || !email || !phoneNumber || !role || !storeName || !storeDescription || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password must be at least 8 characters with uppercase, lowercase, and number' 
        },
        { status: 400 }
      );
    }



    const db = await connectDB();
    const users = db.collection('users');

    // Check if user exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser);
    const user = { ...newUser, _id: result.insertedId, password: undefined };

    // Generate JWT token
    const token = generateToken(user);

    // Set cookie
    const response = NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: { ...user, id: user._id.toString() }
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}