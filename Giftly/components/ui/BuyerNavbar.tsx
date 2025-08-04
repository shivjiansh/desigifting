// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import useAuthStore from '@/store/auth';
// import useCartStore from '@/store/cart';
// import { auth } from '@/lib/firebase';
// import { signOut } from 'firebase/auth';

// export function BuyerNavbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { user, setUser } = useAuthStore();
//   const router = useRouter();
//   const cartCount = useCartStore((state) => state.getCount());

//   const handleLogout = async () => {
//     await signOut(auth);
//     setUser(null);
//     setIsMenuOpen(false);
//     router.push('/auth/login');
//   };

//   return (
//     <nav className="bg-white shadow-lg sticky top-0 z-50">
//       <div className="container flex justify-between items-center h-16">
//         {/* Logo */}
//         <Link href="/" className="text-2xl font-bold text-primary-600" tabIndex={0}>
//           Giftly
//         </Link>

//         <div className="hidden md:flex items-center space-x-8">
//           <Link href="/public/products" className="text-gray-600 hover:text-primary-600">Products</Link>
//           <Link href="/public/categories" className="text-gray-600 hover:text-primary-600">Categories</Link>
//           <Link href="/buyer/orders" className="text-gray-600 hover:text-primary-600">My Orders</Link>
//           <Link href="/public/about" className="text-gray-600 hover:text-primary-600">About</Link>
//           <Link href="/public/contact" className="text-gray-600 hover:text-primary-600">Contact</Link>
//         </div>

//         <div className="hidden md:flex items-center space-x-4">
//           {/* Cart icon */}
//           <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary-600" aria-label="Cart" tabIndex={0}>
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                 d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.32a2 2 0 001.94 2.68h9.44a2 2 0 001.94-2.68L16 13M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6"
//               />
//             </svg>
//             {cartCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                 {cartCount}
//               </span>
//             )}
//           </Link>
//           {/* User Dropdown */}
//           {user ? (
//             <div className="relative">
//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
//                 aria-haspopup="true"
//                 aria-expanded={isMenuOpen}
//                 aria-label="User menu"
//               >
//                 <span>Hi, {user.name}</span>
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
//               </button>
//               {isMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50" role="menu">
//                   <Link href="/buyer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onClick={() => setIsMenuOpen(false)}>
//                     Dashboard
//                   </Link>
//                   <Link href="/buyer/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onClick={() => setIsMenuOpen(false)}>
//                     Profile
//                   </Link>
//                   <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
//                     Sign Out
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="flex items-center space-x-4">
//               <Link href="/auth/login" className="text-gray-600 hover:text-primary-600">Sign In</Link>
//               <Link href="/auth/register-buyer" className="btn-primary">Sign Up</Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth';
import useCartStore from '@/store/cart';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export function BuyerNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, setUser } = useAuthStore();
  const cartCount = useCartStore(state => state.getCount());

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setIsMenuOpen(false);
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary-600">Giftly</Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-7">
          <Link href="/public/products" className="text-gray-700 hover:text-primary-600">Products</Link>
          <Link href="/public/categories" className="text-gray-700 hover:text-primary-600">Categories</Link>
          <Link href="/buyer/orders" className="text-gray-700 hover:text-primary-600">My Orders</Link>
          <Link href="/buyer/profile" className="text-gray-700 hover:text-primary-600">My Profile</Link>
        </div>

        {/* Right Side: Cart and User */}
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative text-gray-700 hover:text-primary-600" aria-label="Cart">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.32a2 2 0 001.94 2.68h9.44a2 2 0 001.94-2.68L16 13" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-1 text-xs">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Authenticated Dropdown */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                aria-label="User menu"
              >
                <span>Hi, {user.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50" role="menu">
                  <Link href="/buyer/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/buyer/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login-buyer" className="text-gray-700 hover:text-primary-600">Sign In</Link>
              <Link href="/auth/register-buyer" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-primary-600"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4">
          <Link href="/public/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Products</Link>
          <Link href="/public/categories" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Categories</Link>
          <Link href="/buyer/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">My Orders</Link>
          <Link href="/buyer/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">My Profile</Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
              Sign Out
            </button>
          ) : (
            <>
              <Link href="/auth/login/buyer" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sign In</Link>
              <Link href="/auth/register-buyer" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
