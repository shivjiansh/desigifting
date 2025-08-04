'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import useAuthStore from '@/store/auth';

export default function BuyerDashboard() {
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your orders, wishlist, and account settings
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <Link
                  href="/buyer/orders"
                  className="card p-4 hover:shadow-md transition-shadow text-center"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">My Orders</h3>
                  <p className="text-sm text-gray-600">Track your purchases</p>
                </Link>

                <Link
                  href="/buyer/wishlist"
                  className="card p-4 hover:shadow-md transition-shadow text-center"
                >
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Wishlist</h3>
                  <p className="text-sm text-gray-600">Saved items</p>
                </Link>

                <Link
                  href="/buyer/profile"
                  className="card p-4 hover:shadow-md transition-shadow text-center"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Profile</h3>
                  <p className="text-sm text-gray-600">Account settings</p>
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              <div className="text-center py-8 text-gray-500">
                <p>No recent orders</p>
                <Link href="/public/products" className="btn-primary mt-4">
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Account Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wishlist Items</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reviews Written</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/buyer/addresses" className="block text-blue-600 hover:underline">
                  Manage Addresses
                </Link>
                <Link href="/buyer/reviews" className="block text-blue-600 hover:underline">
                  My Reviews
                </Link>
                <Link href="/public/contact" className="block text-blue-600 hover:underline">
                  Customer Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}