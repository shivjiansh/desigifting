'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import useAuthStore from '@/store/auth';

const googleProvider = new GoogleAuthProvider();

export default function BuyerRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: 'buyer',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Create buyer profile
      await setDoc(doc(db, 'buyers', userCredential.user.uid), {
        userId: userCredential.user.uid,
        addresses: [],
        wishlist: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update auth store
      setUser({
        uid: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        role: 'buyer',
        phone: formData.phone,
      });

      toast.success('Registration successful!');
      router.push('/buyer/dashboard');
    } catch (error: any) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrors({});
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Create user profile as buyer
      await setDoc(doc(db, 'users', user.uid), {
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

      // Update auth store
      setUser({
        uid: user.uid,
        name: user.displayName || 'Buyer',
        email: user.email || '',
        role: 'buyer',
        phone: user.phoneNumber || '',
      });

      toast.success('Google registration successful!');
      router.push('/buyer/dashboard');
    } catch (error: any) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side: Registration Form */}
            <div className="lg:w-3/5 p-8 lg:p-12">
              <div className="max-w-md mx-auto lg:mx-0">
                <Link href="/" className="inline-block mb-6">
                  <div className="text-3xl font-bold text-primary-600">Giftly</div>
                </Link>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Join Giftly Today
                </h2>
                <p className="text-gray-600 mb-8">
                  Create your account and start discovering amazing gifts
                </p>

                {/* Registration Form */}
                <form onSubmit={handleEmailRegister} className="space-y-6" noValidate>
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`input w-full ${errors.name ? 'input-error' : ''}`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input w-full ${errors.email ? 'input-error' : ''}`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input w-full"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`input w-full ${errors.password ? 'input-error' : ''}`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`input w-full ${errors.confirmPassword ? 'input-error' : ''}`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* General errors */}
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center justify-center space-x-3">
                  <hr className="w-1/4 border-gray-300" />
                  <span className="text-gray-500">or</span>
                  <hr className="w-1/4 border-gray-300" />
                </div>

                {/* Google Sign-Up Button */}
                <button
                  onClick={handleGoogleSignIn}
                  className="btn-primary bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded flex justify-center items-center gap-2"
                  disabled={loading}
                  aria-label="Sign up with Google"
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
                  Sign up with Google
                </button>



                {/* Links */}
                <div className="mt-6 text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/auth/login/buyer" className="font-medium text-primary-600 hover:text-primary-500">
                      Sign in
                    </Link>
                  </p>
                  <p className="text-sm text-gray-600">
                    Want to sell products?{' '}
                    <Link href="/auth/register-seller" className="font-medium text-primary-600 hover:text-primary-500">
                      Register as Seller
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Illustration with DG SHOP */}
            <div className="lg:w-2/5 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8 lg:p-12">
              <div className="text-center">
                <img
                  src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/65a1834b-219e-4c71-8428-cbcc68db2de7.png"
                  alt="Person with shopping cart moving towards DG Shop"
                  className="w-80 h-80 object-contain mx-auto mb-6"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Your Shopping Journey</h3>
                <p className="text-gray-600">Join thousands of happy customers at DG Shop and find your perfect gifts</p>
                                  {/* Welcome Benefits */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">🎉 Welcome Benefits</h4>
                  <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside text-left">
                    <li>Free shipping on your first order</li>
                    <li>Access to exclusive deals and discounts</li>
                    <li>Personalized gift recommendations</li>
                    <li>Easy order tracking and returns</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
