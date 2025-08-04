'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth';
import useCartStore from '@/store/cart';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { BuyerNavbar } from '@/components/ui/BuyerNavbar';

// Icons (you can replace with your preferred icon library)
const ShoppingBagIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const TruckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

interface DashboardStats {
  totalOrders: number;
  wishlistItems: number;
  recentPurchases: number;
  savedAmount: number;
}

interface RecentOrder {
  id: string;
  productName: string;
  amount: number;
  status: string;
  date: string;
  image?: string;
}

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  discount?: number;
}

export default function BuyerDashboard() {
  const { user } = useAuthStore();
  const cartCount = useCartStore((state) => state.getCount());
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    wishlistItems: 0,
    recentPurchases: 0,
    savedAmount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log(user);
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      if (!user) return;

      // Fetch buyer profile data
      const buyerDoc = await getDoc(doc(db, 'buyers', user.uid));
      const buyerData = buyerDoc.data();

      // Fetch recent orders
      const ordersQuery = query(
        collection(db, 'orders'),
        where('buyerId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as RecentOrder[];

      // Calculate stats
      const totalOrders = ordersSnapshot.size;
      const wishlistItems = buyerData?.wishlist?.length || 0;
      const recentPurchases = orders.filter(order => 
        new Date(order.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length;

      setStats({
        totalOrders,
        wishlistItems,
        recentPurchases,
        savedAmount: 150, // This would be calculated based on discounts used
      });

      setRecentOrders(orders);

      // Mock recommended products (in real app, this would be based on user preferences/history)
      setRecommendedProducts([
        {
          id: '1',
          name: 'Wireless Headphones',
          price: 99.99,
          image: '/placeholder-product.jpg',
          rating: 4.5,
          discount: 20,
        },
        {
          id: '2',
          name: 'Smart Watch',
          price: 199.99,
          image: '/placeholder-product.jpg',
          rating: 4.8,
        },
        {
          id: '3',
          name: 'Phone Case',
          price: 29.99,
          image: '/placeholder-product.jpg',
          rating: 4.2,
          discount: 15,
        },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BuyerNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Discover amazing products and track your orders all in one place.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingBagIcon />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-red-100 rounded-lg">
                  <HeartIcon />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.wishlistItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TruckIcon />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Purchases</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentPurchases}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <UserIcon />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Amount Saved</p>
                <p className="text-2xl font-bold text-gray-900">${stats.savedAmount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                <Link href="/buyer/orders" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ShoppingBagIcon />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{order.productName}</p>
                          <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${order.amount}</p>
                        <p className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBagIcon />
                  <p className="text-gray-500 mt-2">No orders yet</p>
                  <Link href="/public/products" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                    Start shopping
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
                <Link href="/public/products" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                  Browse all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recommendedProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden">📦</div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon key={i} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                        </div>
                        {product.discount && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${product.price}</p>
                      <button className="mt-2 bg-primary-600 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-700">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/public/products"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingBagIcon />
              <span className="mt-2 text-sm font-medium text-gray-900">Browse Products</span>
            </Link>
            <Link
              href="/buyer/orders"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TruckIcon />
              <span className="mt-2 text-sm font-medium text-gray-900">Track Orders</span>
            </Link>
            <Link
              href="/buyer/wishlist"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <HeartIcon />
              <span className="mt-2 text-sm font-medium text-gray-900">My Wishlist</span>
            </Link>
            <Link
              href="/buyer/profile"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserIcon />
              <span className="mt-2 text-sm font-medium text-gray-900">My Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
