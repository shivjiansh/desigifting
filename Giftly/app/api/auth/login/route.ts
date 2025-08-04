import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyPassword, generateToken, isValidEmail, rateLimit } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.ip || 'unknown';

    // Rate limiting
    if (!rateLimit(`login:${clientIp}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, message: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const users = db.collection('users');

    // Find user
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user);

    // Remove password from user object
    const userWithoutPassword = { ...user, password: undefined };

    // Set cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: { ...userWithoutPassword, id: user._id.toString() }
    });
    console.log("Setting auth-token cookie"),

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'local',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}