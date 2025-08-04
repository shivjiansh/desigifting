// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { verifyToken } from './lib/auth';

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get('auth-token')?.value;

//   // Protect buyer routes
//   if (pathname.startsWith('/buyer')) {
//     if (!token) {
//       return NextResponse.redirect(new URL('/auth/login', request.url));
//     }

//     try {
//       const user = await verifyToken(token);
//       if (!user || user.role !== 'buyer') {
//         return NextResponse.redirect(new URL('/auth/login', request.url));
//       }
//     } catch (error) {
//       return NextResponse.redirect(new URL('/auth/login', request.url));
//     }
//   }

//   // Protect seller routes
//   if (pathname.startsWith('/seller')) {
//     console.log('🔒 Checking token:', token);
// console.log('🔁 Requested path:', pathname);
//     if (!token) {
//       console.log("No token found, redirecting to login");
//       return NextResponse.redirect(new URL('/auth/login', request.url));
//     }

//     try {
//       const user = await verifyToken(token);
//       console.log("Token verified, user:", user);
//       if (!user || user.role !== 'seller') {
//         return NextResponse.redirect(new URL('/auth/login', request.url));
//       }
//     } catch (error) {
//       return NextResponse.redirect(new URL('/auth/login', request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/buyer/:path*', '/seller/:path*']
// };

import { NextRequest, NextResponse } from 'next/server';

// Define public paths that don't require authentication
const publicPaths = [
  '/',
  '/auth/login/buyer',
  '/auth/login/seller', 
  '/auth/register/buyer',
  '/auth/register/seller',
  '/auth/phone-signin',
  '/public/products',
  '/public/categories',
  '/public/about',
  '/public/contact',
];

// Define buyer-only paths
const buyerPaths = [
  '/buyer',
  '/cart',
  '/checkout',
  '/buyer/orders',
];

// Define seller-only paths
const sellerPaths = [
  '/seller',
  '/seller/dashboard',
  '/seller/products',
  '/seller/orders',
  '/seller/payouts',
  '/seller/pending-approval',
];

// Check if the path matches any pattern in the array
function matchesPath(pathname: string, paths: string[]): boolean {
  return paths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Allow public paths
  if (matchesPath(pathname, publicPaths)) {
    return NextResponse.next();
  }

  try {
    // Get the authentication token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      // No token found, redirect to appropriate login page
      if (matchesPath(pathname, sellerPaths)) {
        return NextResponse.redirect(new URL('/auth/login/seller', request.url));
      }
      return NextResponse.redirect(new URL('/auth/login/buyer', request.url));
    }
  }
  catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.redirect(new URL('/auth/login/buyer', request.url));
  }
};
