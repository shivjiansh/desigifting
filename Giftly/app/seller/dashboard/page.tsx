'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import Link from 'next/link';
import { toast } from 'sonner';

type SellerStat = {
  totalProducts: number;
  totalSales: number;
  totalOrders: number;
  isApproved: boolean;
};

export default function SellerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [stats, setStats] = useState<SellerStat>({
    totalProducts: 0,
    totalSales: 0,
    totalOrders: 0,
    isApproved: false,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login/seller');
      return;
    }
    async function fetchStatsAndOrders() {
      setLoading(true);
      try {
        // Fetch products
        const productsSnap = await getDocs(
          query(collection(db, 'products'), where('sellerId', '==', user.uid))
        );
        // Fetch orders where at least one item has product with sellerId
        const ordersSnap = await getDocs(
          query(
            collection(db, 'orders'),
            where('items', 'array-contains-any', []), // dummy but replace with custom Cloud Function for production
            orderBy('createdAt', 'desc'),
            limit(6)
          )
        );
        // For multi-vendor, best done via Cloud Function
        // Here, show all orders for current seller.
        const orders: any[] = [];
        ordersSnap.forEach((doc) =>
          doc.data().items.some((i: any) => i.sellerId === user.uid)
            ? orders.push({ id: doc.id, ...doc.data() })
            : null
        );
        // Fetch stats from sellers/{uid}
        const sellerDocSnap = await getDocs(
          query(collection(db, 'sellers'), where('userId', '==', user.uid))
        );
        let isApproved = false;
        if (!sellerDocSnap.empty) {
          isApproved = sellerDocSnap.docs[0].data()?.isApproved ?? false;
        }
        setStats({
          totalProducts: productsSnap.size,
          totalSales: orders.reduce(
            (acc, order) =>
              acc +
              order.items
                .filter((i: any) => i.sellerId === user.uid)
                .reduce((a: number, i: any) => a + i.price * i.quantity, 0),
            0
          ),
          totalOrders: orders.length,
          isApproved,
        });
        setRecentOrders(orders.slice(0, 5)); // show latest 5
      } catch (e: any) {
        toast.error(e.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    }
    fetchStatsAndOrders();
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard label="Products" value={stats.totalProducts} icon="📦" highlight />
        <DashboardCard label="Total Sales" value={`₹${stats.totalSales}`} icon="💰" />
        <DashboardCard label="Orders" value={stats.totalOrders} icon="🧾" />
        <DashboardCard
          label="Status"
          value={stats.isApproved ? 'Approved' : 'Pending'}
          icon={stats.isApproved ? "✅" : "⏳"}
          highlight={!!stats.isApproved}
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <aside className="md:col-span-1 bg-white rounded shadow p-6 flex flex-col space-y-4">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <Link href="/seller/products/add" className="btn-primary w-full text-center">
            + Add New Product
          </Link>
          <Link href="/seller/orders" className="btn-outline w-full text-center">
            Manage Orders
          </Link>
          <Link href="/seller/profile" className="btn-outline w-full text-center">
            Edit Store Profile
          </Link>
          {!stats.isApproved && (
            <p className="text-yellow-700 bg-yellow-100 rounded px-2 py-1 text-sm mt-4">
              Your store is pending approval. You will be notified by email soon.
            </p>
          )}
        </aside>

        {/* Recent Orders */}
        <section className="md:col-span-2 bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          {loading ? (
            <p className="text-gray-500">Loading recent orders…</p>
          ) : recentOrders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <li key={order.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-medium">Order #{order.id.slice(0, 8)}</span>
                    <span className="ml-2 text-xs text-gray-400">
                      {order.createdAt?.toDate?.().toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-700">
                      {order.items
                        .filter((item: any) => item.sellerId === user.uid)
                        .map((item: any) => `${item.name} x${item.quantity}`)
                        .join(', ')}
                    </span>
                  </div>
                  <span className="text-primary-600 font-semibold">
                    ₹
                    {order.items
                      .filter((item: any) => item.sellerId === user.uid)
                      .reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
                      .toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}

function DashboardCard({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center bg-white rounded-lg p-6 shadow ${
        highlight ? 'border-2 border-primary-500' : ''
      }`}
    >
      <span className="text-4xl mb-2">{icon}</span>
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-gray-600 mt-1">{label}</span>
    </div>
  );
}
