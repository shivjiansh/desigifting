// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import { User } from './types';

// if (!process.env.JWT_SECRET) {
//   throw new Error('Please define the JWT_SECRET environment variable');
// }

// const JWT_SECRET = process.env.JWT_SECRET;

// export async function hashPassword(password: string): Promise<string> {
//   return bcrypt.hash(password, 12);
// }

// export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
//   return bcrypt.compare(password, hashedPassword);
// }

// export function generateToken(user: User): string {
//   return jwt.sign(
//     { 
//       userId: user._id || user.id, 
//       email: user.email, 
//       role: user.role 
//     },
//     JWT_SECRET,
//     { expiresIn: '7d' }
//   );
// //   return jwt.sign(
// //   { foo: 'bar' },
// //   null, // No secret
// //   { algorithm: 'none' } // You must specify it
// // );
// }

// export async function verifyToken(token: string): Promise<any> {
//   try {
//     console.log("Verifying token:", token);
//     return jwt.verify(token, JWT_SECRET);
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     throw new Error('Invalid token');
//   }
// }

// export function isValidEmail(email: string): boolean {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

// export function isValidPassword(password: string): boolean {
//   // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
//   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
//   return passwordRegex.test(password);
// }

// // Rate limiting in memory (for production, use Redis)
// const rateLimitMap = new Map();

// export function rateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
//   const now = Date.now();
//   const windowStart = now - windowMs;

//   if (!rateLimitMap.has(identifier)) {
//     rateLimitMap.set(identifier, []);
//   }

//   const attempts = rateLimitMap.get(identifier);

//   // Remove old attempts outside the window
//   const recentAttempts = attempts.filter((timestamp: number) => timestamp > windowStart);
//   rateLimitMap.set(identifier, recentAttempts);

//   if (recentAttempts.length >= maxAttempts) {
//     return false; // Rate limit exceeded
//   }

//   recentAttempts.push(now);
//   return true; // Request allowed
// }


// lib/auth.ts

import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { User } from './types';

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

const JWT_SECRET = process.env.JWT_SECRET!;
const ENCODED_SECRET = new TextEncoder().encode(JWT_SECRET); // Required for jose

// Hash plain password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Compare plain with hashed password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Sign JWT for login
export function generateToken(user: User): string {
  return jwt.sign(
    {
      userId: user._id || user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ✅ Use in Edge-compatible environments (middleware.ts)
export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, ENCODED_SECRET);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
}

// Email format check
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password strength check
export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

// 🧠 In-memory rate limiter (dev only; use Redis for prod)
const rateLimitMap: Map<string, number[]> = new Map();

export function rateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  const attempts = rateLimitMap.get(identifier) || [];

  const recentAttempts = attempts.filter((ts) => ts > windowStart);
  rateLimitMap.set(identifier, recentAttempts);

  if (recentAttempts.length >= maxAttempts) {
    return false;
  }

  recentAttempts.push(now);
  return true;
}
