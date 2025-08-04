'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cart';
import useAuthStore from '@/store/auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import SellerDashboard from '@/app/seller/page';

interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  // Shipping form state
  const [address, setAddress] = useState<Address>({
    fullName: user?.name || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India' ||'',
    phone: user?.phone || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [loading, setLoading] = useState(false);

  // Calculate order subtotal and totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxRate = 0.05; // 5% GST for example
  const shippingCharge = subtotal > 1000 ? 0 : 50; // Free shipping above ₹1000
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount + shippingCharge;

  // Validate form fields
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Address, string>> = {};
    if (!address.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!address.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state.trim()) newErrors.state = 'State is required';
    if (!address.postalCode.trim()) newErrors.postalCode = 'Postal Code is required';
    if (!address.country.trim()) newErrors.country = 'Country is required';
    if (!address.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^[\d\s-+()]+$/.test(address.phone)) newErrors.phone = 'Invalid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const onChangeAddress = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Remove error on change
    if (errors[name as keyof Address]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name as keyof Address];
        return copy;
      });
    }
  };

  // Place order handler
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }
    if (!user) {
      toast.error('Please login to place an order.');
      router.push('/auth/login');
      return;
    }
    if (!validate()) {
      toast.error('Please fix the errors in the form.');
      return;
    }
    setLoading(true);
    try {
      // Create order document in Firestore
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: cartItems.map(({ id, quantity, price, name }) => ({ productId: id, quantity, price, name })),
        shippingAddress: address,
        paymentMethod,
        subtotal,
        taxAmount,
        shippingCharge,
        total,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        sellerId: cartItems[0]?.sellerId, // Assuming all items are from the same seller
      });
      clearCart();
      toast.success('Order placed successfully!');
      router.push('/buyer/orders');
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Summary */}
        <section className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={address.fullName}
                  onChange={onChangeAddress}
                  className={`input ${errors.fullName ? 'input-error' : ''}`}
                  required
                />
                {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={address.phone}
                  onChange={onChangeAddress}
                  className={`input ${errors.phone ? 'input-error' : ''}`}
                  required
                />
                {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={address.addressLine1}
                onChange={onChangeAddress}
                className={`input ${errors.addressLine1 ? 'input-error' : ''}`}
                required
              />
              {errors.addressLine1 && <p className="text-red-600 text-sm">{errors.addressLine1}</p>}
            </div>
            <div>
              <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                value={address.addressLine2}
                onChange={onChangeAddress}
                className="input"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={address.city}
                  onChange={onChangeAddress}
                  className={`input ${errors.city ? 'input-error' : ''}`}
                  required
                />
                {errors.city && <p className="text-red-600 text-sm">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={address.state}
                  onChange={onChangeAddress}
                  className={`input ${errors.state ? 'input-error' : ''}`}
                  required
                />
                {errors.state && <p className="text-red-600 text-sm">{errors.state}</p>}
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={address.postalCode}
                  onChange={onChangeAddress}
                  className={`input ${errors.postalCode ? 'input-error' : ''}`}
                  required
                />
                {errors.postalCode && <p className="text-red-600 text-sm">{errors.postalCode}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={address.country}
                onChange={onChangeAddress}
                className={`input ${errors.country ? 'input-error' : ''}`}
                required
              />
              {errors.country && <p className="text-red-600 text-sm">{errors.country}</p>}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mr-2"
                  />
                  Cash On Delivery
                </label>
                {/* Future: Add online payment option */}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? 'Placing Order...' : `Pay ₹${total.toFixed(2)}`}
            </button>
          </form>
        </section>

        {/* Order Summary */}
        <aside className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto mb-6">
              {cartItems.map(item => (
                <li key={item.id} className="flex justify-between py-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingCharge === 0 ? 'Free' : `₹${shippingCharge.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
