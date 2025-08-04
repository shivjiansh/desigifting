'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase'; // your Firebase initialization
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { validateEmail, validatePassword } from '@/lib/utils';
import useAuthStore from '@/store/auth';

export default function SellerRegister() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phoneNumber: '',
    storeName: '',
    storeDescription: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.displayName.trim()) newErrors.displayName = 'Full name is required';
    if (!form.storeName.trim()) newErrors.storeName = 'Store name is required';
    if (!form.storeDescription.trim()) newErrors.storeDescription = 'Store description is required';
    if (!validateEmail(form.email)) newErrors.email = 'Invalid email address';

    const passwordValidation = validatePassword(form.password);
    if (!passwordValidation.isValid) newErrors.password = passwordValidation.errors[0];

    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create Firebase Auth user
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = cred.user;

      // Save seller profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: form.displayName,
        email: form.email,
        phone: form.phoneNumber || '',
        role: 'seller',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Seller-specific document
      await setDoc(doc(db, 'sellers', user.uid), {
        userId: user.uid,
        storeName: form.storeName,
        storeDescription: form.storeDescription,
        isApproved: false, // default new seller approval pending
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setUser({
        uid: user.uid,
        name: form.displayName,
        email: form.email,
        role: 'seller',
        phone: form.phoneNumber || '',
      });

      toast.success('Seller registration successful! Awaiting approval.');
      router.push('/seller/pending-approval');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In registration
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user doc exists, else create
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await userRef.get();
      if (!userSnap.exists()) {
        // Create user document
        await setDoc(userRef, {
          name: user.displayName || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          role: 'seller',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        await setDoc(doc(db, 'sellers', user.uid), {
          userId: user.uid,
          storeName: '',
          storeDescription: '',
          isApproved: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setUser({
        uid: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        role: 'seller',
        phone: user.phoneNumber || '',
      });

      toast.success('Google sign-in successful! Complete your profile.');
      router.push('/seller/pending-approval');
    } catch (error: any) {
      toast.error(error.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-center text-3xl font-extrabold mb-6">Create Seller Account</h2>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="displayName"
              id="displayName"
              value={form.displayName}
              onChange={handleChange}
              className={`input w-full ${errors.displayName ? 'input-error' : ''}`}
              required
            />
            {errors.displayName && <p className="text-red-600 text-sm mt-1">{errors.displayName}</p>}
          </div>

          <div>
            <label htmlFor="storeName" className="block font-medium text-gray-700 mb-1">Store Name</label>
            <input
              type="text"
              name="storeName"
              id="storeName"
              value={form.storeName}
              onChange={handleChange}
              className={`input w-full ${errors.storeName ? 'input-error' : ''}`}
              required
            />
            {errors.storeName && <p className="text-red-600 text-sm mt-1">{errors.storeName}</p>}
          </div>

          <div>
            <label htmlFor="storeDescription" className="block font-medium text-gray-700 mb-1">Store Description</label>
            <textarea
              name="storeDescription"
              id="storeDescription"
              rows={3}
              value={form.storeDescription}
              onChange={handleChange}
              className={`input w-full resize-none ${errors.storeDescription ? 'input-error' : ''}`}
              required
            />
            {errors.storeDescription && <p className="text-red-600 text-sm mt-1">{errors.storeDescription}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              className={`input w-full ${errors.email ? 'input-error' : ''}`}
              required
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="input w-full"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className={`input w-full ${errors.password ? 'input-error' : ''}`}
              required
              autoComplete="new-password"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`input w-full ${errors.confirmPassword ? 'input-error' : ''}`}
              required
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 font-semibold"
          >
            {loading ? 'Registering…' : 'Register as Seller'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">Or register with</p>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 w-full"
            aria-label="Sign up with Google"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 48 48" focusable="false" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.08h-2.3v-.01H24v7.83h11.14c-1.08 5.93-7.06 10.17-13.14 10.17-7.6 0-13.75-6.16-13.75-13.75s6.15-13.75 13.75-13.75c3.8 0 7.26 1.48 9.82 3.88l5.21-5.21c-3.83-3.54-8.9-5.69-14.22-5.69C12.95 5 4 13.95 4 25s8.95 20 20 20c11.05 0 20-8.95 20-20 0-1.35-.15-2.66-.4-3.92z"/>
              <path fill="#FF3D00" d="M6.3 14.69l5.56 5.21c1.68-4.61 6.73-7.63 11.63-6.98 3.53.48 6.54 2.59 8.46 5.5h-.02l-13.14 13.14z"/>
              <path fill="#4CAF50" d="M24 43.75c5.69 0 10.65-2.3 14.27-6.05l-6.66-5.44c-1.94 1.47-4.43 2.34-7.61 2.34-6.08 0-11.71-4.24-13.73-10.07l-6.79 5.22c2.92 5.69 8.99 10.06 15.52 10.06z"/>
              <path fill="#1976D2" d="M43.6 20.08h-2.3v-.01H24v7.83h11.14c-1.2 6.59-7.64 11.2-14.19 11.2-7.6 0-13.75-6.16-13.75-13.75s6.15-13.75 13.75-13.75c3.8 0 7.52 1.56 10.6 4.01l5.27-5.27c-.01 0 .01.01-.01.02z"/>
            </svg>
            Google
          </button>
        </div>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link href="/auth/login/seller" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
