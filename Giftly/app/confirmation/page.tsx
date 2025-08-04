'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ConfirmationPage() {
  const router = useRouter();

  // Optional: If you want to redirect after some seconds
  /*
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/'); // redirect to home page or orders page after 5s
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);
  */

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-xl w-full bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-green-600">Thank You!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Your order has been placed successfully.
        </p>

        <p className="text-gray-600 mb-8">
          We are processing your order and will notify you when it ships.
        </p>

        <button
          onClick={() => router.push('/')}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
