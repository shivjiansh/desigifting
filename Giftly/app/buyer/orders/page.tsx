'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import useAuthStore from '@/store/auth';
import { toast } from 'sonner';
import Link from 'next/link';
import { Loader } from '@/components/ui/Loader';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  createdAt: any;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

export default function BuyerOrdersPage() {
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      toast.error('You must be logged in to view orders');
      router.push('/auth/login/buyer');
      return;
    }

    async function fetchOrders() {
      setLoading(true);
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);

        const ordersData: Order[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            createdAt: data.createdAt,
            status: data.status,
            items: data.items,
            total: data.total,
          };
        });

        setOrders(ordersData);
      } catch (e: any) {
        console.error('Error fetching orders:', e);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user, router]);

  if (loading) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-gray-700 text-xl">You have no orders yet.</p>
        <Link href="/public/products" className="btn-primary px-6 py-2">
          Shop Now
        </Link>
      </main>
    );
  }

  // Helper to format timestamp (if Firestore Timestamp)
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      return '';
    }
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Status badge colors
  const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <section className="space-y-6">
        {orders.map(order => (
          <article
            key={order.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            aria-label={`Order ${order.id}`}
          >
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</p>
              <time className="text-gray-500" dateTime={order.createdAt?.toDate?.().toISOString()}>
                {formatDate(order.createdAt)}
              </time>
            </div>

            <div className="flex justify-between items-center mb-3">
              <div
                className={`inline-block rounded px-3 py-1 text-sm font-medium ${statusColors[order.status]}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
              <p className="text-gray-700">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
              <p className="text-lg font-semibold">₹{order.total.toFixed(2)}</p>
            </div>

            <details>
              <summary className="cursor-pointer text-primary-600 hover:underline mb-2">
                View Items
              </summary>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {order.items.map((item, idx) => (
                  <li key={`${order.id}-item-${idx}`}>
                    {item.name} x {item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </details>
          </article>
        ))}
      </section>
    </main>
  );
}
