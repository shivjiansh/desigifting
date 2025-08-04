import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = await verifyToken(token);

    const db = await connectDB();
    const users = db.collection('users');

    // Get user from database
    const user = await users.findOne({ _id: decoded.userId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password from response
    const userWithoutPassword = { ...user, password: undefined };

    return NextResponse.json({
      success: true,
      user: { ...userWithoutPassword, id: user._id.toString() }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid token' },
      { status: 401 }
    );
  }
}