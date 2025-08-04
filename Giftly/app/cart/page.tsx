'use client';

import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import useCartStore from '@/store/cart';

export default function CartPage() {
  const { items, total, shipping, tax, updateQuantity, removeItem, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="container py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 4.32a2 2 0 001.94 2.68h9.44a2 2 0 001.94-2.68L16 13M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some products to get started</p>
            <Link href="/public/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {items.map((item) => (
                <div key={item.id || item._id} className="border-b border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 mr-4">
                      <Link 
                      key={item._id} 
                      href={`/public/products/${item._id}`}
                      
                    >
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        Image
                      </div>
                      </Link>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 mt-1">₹{item.price}</p>
                    </div>

                    <div className="flex items-center ml-4">
                      <button
                        onClick={() => updateQuantity(item.id || item._id || '', item.quantity - 1)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="mx-3 text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id || item._id || '', item.quantity + 1)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id || item._id || '')}
                      className="ml-4 text-red-400 hover:text-red-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                // </Link>
              ))}
            </div>

            <div className="mt-4">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${(total - tax - shipping).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/cart/checkout"
                className="btn-primary w-full mt-6 justify-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}