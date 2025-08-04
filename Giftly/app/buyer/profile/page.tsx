'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth';
import { toast } from 'sonner';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
}

interface BuyerProfile {
  addresses: string[];  // For demo, simple array of address strings
  wishlist: string[];   // Array of product IDs or names
}

export default function BuyerProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [userData, setUserData] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
  });
  const [buyerData, setBuyerData] = useState<BuyerProfile>({
    addresses: [],
    wishlist: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user and buyer profile from Firestore
  useEffect(() => {
    if (!user?.uid) {
      setError('User not logged in');
      router.push('/auth/login/buyer'); // redirect to login
      return;
    }

    async function fetchProfile() {
      setLoading(true);
      try {
        // Fetch base user data
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData({
            name: data.name || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
          });
        } else {
          setError('User profile not found');
        }

        // Fetch buyer-specific data
        const buyerRef = doc(db, 'buyers', user.uid);
        const buyerSnap = await getDoc(buyerRef);
        if (buyerSnap.exists()) {
          const data = buyerSnap.data();
          setBuyerData({
            addresses: data.addresses || [],
            wishlist: data.wishlist || [],
          });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user?.uid, user?.email, router]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile updates
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      if (!user?.uid) throw new Error('Not authenticated');
      if (!userData.name.trim()) throw new Error('Name cannot be empty');

      // Update user basic info
      await setDoc(
        doc(db, 'users', user.uid),
        {
          name: userData.name.trim(),
          phone: userData.phone?.trim() || '',
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Dummy handlers for addresses and wishlist can be added here later

  if (loading) return <p className="p-8 text-center text-gray-500">Loading Profile...</p>;

  if (error)
    return (
      <p className="p-8 text-center text-red-600 font-semibold" role="alert" aria-live="assertive">
        {error}
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="space-y-6">
        {/* User Info Form */}
        <section aria-label="User Information" className="bg-white p-6 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block font-medium mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={userData.name}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium mb-1">
                Email (read-only)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={userData.email}
                className="input w-full bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="phone" className="block font-medium mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={userData.phone}
                onChange={handleChange}
                className="input w-full"
                placeholder="Optional"
              />
            </div>
          </div>
          <button
            disabled={saving}
            onClick={handleSave}
            className={`btn-primary mt-6 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </section>

        {/* Addresses (stub) */}
        <section aria-label="Addresses" className="bg-white p-6 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
          {buyerData.addresses.length === 0 ? (
            <p className="text-gray-600 italic">No saved addresses.</p>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {buyerData.addresses.map((addr, idx) => (
                <li key={idx} className="text-gray-700">
                  {addr}
                </li>
              ))}
            </ul>
          )}
          {/* TODO: Add UI to add/edit addresses */}
        </section>

        {/* Wishlist (stub) */}
        <section aria-label="Wishlist" className="bg-white p-6 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
          {buyerData.wishlist.length === 0 ? (
            <p className="text-gray-600 italic">Your wishlist is empty.</p>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {buyerData.wishlist.map((item, idx) => (
                <li key={idx} className="text-gray-700">
                  {item /* you can replace with product links */}
                </li>
              ))}
            </ul>
          )}
          {/* TODO: Add UI to manage wishlist */}
        </section>
      </div>
    </div>
  );
}
