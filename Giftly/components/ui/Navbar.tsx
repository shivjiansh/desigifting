'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import useAuthStore from '@/store/auth'; // your Zustand/fake auth store
import useCartStore from '@/store/cart';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Access user info, auth state, logout action from your auth store
  const { user, isAuthenticated, setUser } = useAuthStore();
  const cartCount = useCartStore((state) => state.getCount());

  // Sync Firebase Auth state with your auth store on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Optionally load additional user profile data from Firestore here
        // Example:
        // const userProfile = await getUserProfile(firebaseUser.uid);
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          role: user?.role || 'buyer', // You should load role properly from DB on login
          phone: firebaseUser.phoneNumber || '',
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  // Logout handler: sign out from Firebase and reset auth state
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign out
      setUser(null); // Clear user from your auth store
      setIsMenuOpen(false);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600" tabIndex={0}>
            Giftly
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/public/products" className="text-gray-600 hover:text-primary-600" tabIndex={0}>
              Products
            </Link>
            <Link href="/public/categories" className="text-gray-600 hover:text-primary-600" tabIndex={0}>
              Categories
            </Link>
            <Link href="/public/about" className="text-gray-600 hover:text-primary-600" tabIndex={0}>
              About
            </Link>
            <Link href="/public/contact" className="text-gray-600 hover:text-primary-600" tabIndex={0}>
              Contact
            </Link>
          </div>

          {/* Right Side (Cart & User Menu) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Show cart icon only if user is not a seller */}
            {(!user || user.role !== 'seller') && (
              <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary-600" aria-label="Cart" tabIndex={0}>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.32a2 2 0 001.94 2.68h9.44a2 2 0 001.94-2.68L16 13M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                  aria-label="User menu"
                  tabIndex={0}
                >
                  <span>Hi, {user.name}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <Link
                      href={user.role === 'buyer' ? '/buyer' : '/seller'}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href={`/${user.role}/profile`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={0}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-gray-600 hover:text-primary-600" tabIndex={0}>
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary" tabIndex={0}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-primary-600"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              <Link
                href="/public/products"
                className="block px-3 py-2 text-gray-600 hover:bg-gray-100"
                tabIndex={0}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/public/categories"
                className="block px-3 py-2 text-gray-600 hover:bg-gray-100"
                tabIndex={0}
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/public/about"
                className="block px-3 py-2 text-gray-600 hover:bg-gray-100"
                tabIndex={0}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/public/contact"
                className="block px-3 py-2 text-gray-600 hover:bg-gray-100"
                tabIndex={0}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {isAuthenticated && user ? (
                <>
                  <Link
                    href={user.role === 'buyer' ? '/buyer' : '/seller'}
                    className="block px-3 py-2 text-gray-600 hover:bg-gray-100"
                    tabIndex={0}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100"
                    tabIndex={0}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 text-gray-600 hover:bg-gray-100"
                    tabIndex={0}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-3 py-2 text-gray-600 hover:bg-gray-100"
                    tabIndex={0}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
