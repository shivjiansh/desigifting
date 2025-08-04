'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import useAuthStore from '@/store/auth';

const googleProvider = new GoogleAuthProvider();

export default function BuyerLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(form.email && form.password)) {
      setError('Email and Password are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Sign in with Email/Password
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // Check Firestore if user has buyer role
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        setError('User profile does not exist.');
        setLoading(false);
        return;
      }

      const userData = userSnap.data();

      if (userData.role !== 'buyer') {
        setError('You are not registered as a buyer. Please use the seller login page.');
        setLoading(false);
        return;
      }

      // Update auth store
      setUser({
        uid: user.uid,
        name: userData.name || user.displayName || 'Buyer',
        email: user.email || '',
        role: 'buyer',
        phone: userData.phone || '',
      });

      toast.success('Login successful!');
      router.push('/buyer/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user profile already exists
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        // Create user profile as buyer
        await setDoc(userDocRef, {
          name: user.displayName || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          role: 'buyer',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        await setDoc(doc(db, 'buyers', user.uid), {
          userId: user.uid,
          addresses: [],
          wishlist: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        // If user exists, check role
        const userData = userSnap.data();
        if (userData.role !== 'buyer') {
          setError('You are not registered as a buyer. Please use the seller login page.');
          setLoading(false);
          return;
        }
      }

      // Update auth store
      setUser({
        uid: user.uid,
        name: user.displayName || 'Buyer',
        email: user.email || '',
        role: 'buyer',
        phone: user.phoneNumber || '',
      });

      toast.success('Google sign-in successful!');
      router.push('/buyer/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side: Login Form */}
            <div className="lg:w-3/5 p-8 lg:p-12">
              <div className="max-w-md mx-auto lg:mx-0">
                <Link href="/" className="inline-block mb-6">
                  <div className="text-3xl font-bold text-primary-600">Giftly</div>
                </Link>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back!
                </h2>
                <p className="text-gray-600 mb-8">
                  Sign in to discover amazing gifts and products
                </p>

                {/* Email/Password Login Form */}
                <form onSubmit={handleEmailLogin} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      className="input w-full"
                      onChange={handleChange}
                      required
                      value={form.email}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="input w-full"
                      onChange={handleChange}
                      required
                      value={form.password}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button 
                    type="submit" 
                    className="btn-primary w-full py-3" 
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center justify-center space-x-3">
                  <hr className="w-1/4 border-gray-300" />
                  <span className="text-gray-500">or</span>
                  <hr className="w-1/4 border-gray-300" />
                </div>

                {/* Google Sign-In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  className="btn-primary bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded flex justify-center items-center gap-2"
                  disabled={loading}
                  aria-label="Sign in with Google"
                >
                  {/* Google SVG Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width="20"
                    height="20"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path fill="#FFC107" d="M43.611 20.083h-2.296v-.007H24v7.833h11.142c-1.076 5.926-7.06 10.172-13.142 10.172-7.59 0-13.75-6.162-13.75-13.75s6.16-13.75 13.75-13.75c3.802 0 7.26 1.475 9.827 3.884l5.204-5.204C34.62 7.138 29.572 5 24 5 12.954 5 4 13.954 4 25s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.349-.154-2.66-.389-3.917z"/>
                    <path fill="#FF3D00" d="M6.306 14.691L11.87 19.9c1.677-4.61 6.733-7.63 11.635-6.982 3.534.485 6.536 2.593 8.46 5.503h-.002l5.2-5.2c-4.566-4.25-11.059-5.4-17.1-3.045-4.452 1.779-7.963 5.805-8.97 10.825z"/>
                    <path fill="#4CAF50" d="M24 43.75c5.688 0 10.648-2.31 14.267-6.056l-6.657-5.434c-1.94 1.473-4.43 2.34-7.61 2.34-6.083 0-11.712-4.243-13.73-10.07l-6.79 5.22c2.918 5.685 8.994 9.999 15.66 9.999z"/>
                    <path fill="#1976D2" d="M43.611 20.083h-2.296v-.007H24v7.833h11.142c-1.197 6.59-7.644 11.199-14.195 11.199-7.59 0-13.75-6.162-13.75-13.75s6.16-13.75 13.75-13.75c3.802 0 7.52 1.555 10.595 4.01l5.274-5.275c-3.126-2.952-7.34-4.588-11.869-4.588-10.046 0-18.19 8.144-18.19 18.19 0 10.046 8.145 18.19 18.19 18.19 9.2 0 16.781-6.79 18.063-15.385z"/>
                  </svg>
                  Sign in with Google
                </button>

                {/* Additional Info */}
                <div className="bg-purple-50 border border-purple-200 rounded-md p-4 mt-6">
                  <h4 className="text-sm font-medium text-purple-800 mb-2">🎁 Your Shopping Benefits</h4>
                  <ul className="text-sm text-purple-700 space-y-1 list-disc list-inside">
                    <li>Browse thousands of unique gifts</li>
                    <li>Save items to your wishlist</li>
                    <li>Track your orders and deliveries</li>
                    <li>Get personalized recommendations</li>
                  </ul>
                </div>

                {/* Links */}
                <div className="mt-6 text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    New to Giftly?{' '}
                    <Link href="/auth/register-buyer" className="font-medium text-primary-600 hover:text-primary-500">
                      Create an account
                    </Link>
                  </p>
                  <p className="text-sm text-gray-600">
                    Want to sell products?{' '}
                    <Link href="/auth/login/seller" className="font-medium text-primary-600 hover:text-primary-500">
                      Seller Login
                    </Link>
                  </p>
                  <p className="text-sm text-gray-600">
                    <Link href="/auth/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                      Forgot your password?
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Illustration */}
            <div className="lg:w-2/5 bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-8 lg:p-12">
              <div className="text-center">
                <img
                  src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/6f0d9cde-1511-4943-99ee-3bdae094da36.png"
                  alt="Person choosing from multiple colorful gift boxes"
                  className="w-80 h-80 object-contain mx-auto mb-6"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Discover Perfect Gifts</h3>
                <p className="text-gray-600">Choose from thousands of unique products and gifts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
