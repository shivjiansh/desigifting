"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth";
import { toast } from "sonner";

type Order = {
  id: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  buyerId: string;
  buyerName: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  subtotal: number;
  taxAmount: number;
  shippingCharge: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  sellerId: string;
};

const statusOptions = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "returned",
  "canceled",
];

export default function SellerOrdersPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    fetch(`/api/seller/orders?sellerId=${user.uid}`)
      .then(async (res) => {
        if (!res.ok) {
          const { error } = await res.json().catch(() => ({}));
          throw new Error(error || "Failed to fetch orders");
        }
        const data = await res.json();
        return data;
      })
      .then((data) => {
        setOrders(data.orders || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const lowerSearch = searchTerm.toLowerCase();
    return orders.filter(
      (order) =>
        (order.buyerName?.toLowerCase().includes(lowerSearch) ?? false) ||
        (order.id?.toLowerCase().includes(lowerSearch) ?? false)
    );
  }, [orders, searchTerm]);

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingOrderId(orderId);
    try {
      const response = await fetch(`/api/seller/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        const { error } = await response.json().catch(() => ({}));
        throw new Error(error || "Failed to update status");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated");
    } catch (e: any) {
      toast.error(e.message || "Error updating status");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <input
          type="search"
          placeholder="Search by buyer or order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 w-64"
          aria-label="Search orders"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="space-y-6">
          {filteredOrders.map((order) => (
            <li key={order.id} className="border rounded p-4 shadow relative">
              <h2 className="text-lg font-semibold mb-2">
                Order ID: {order.id}
              </h2>

              <label htmlFor={`status-${order.id}`} className="block font-bold">
                Status:
              </label>
              <select
                id={`status-${order.id}`}
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                disabled={updatingOrderId === order.id}
                className="mb-4 p-1 border rounded"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>

              <p>
                <strong>Buyer Name:</strong> {order.shippingAddress.fullName}
              </p>
              <p>
                <strong>Total:</strong> ${order.total.toFixed(2)}
              </p>

              <p>
                <strong>Items:</strong>
              </p>
              <ul className="list-disc pl-5">
                {order.items.map(({ productId, quantity, price, name }) => (
                  <li key={productId}>
                    {name} - Quantity: {quantity} - Price: ${price.toFixed(2)}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedOrder(order)}
                className="
    mt-4 inline-flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-md font-medium 
    rounded shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500
    focus:ring-offset-2 transition
  "
                aria-label="See more details"
              >
                See More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal popup for order details */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg overflow-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4">
              Order Details - {selectedOrder.id}
            </h2>

            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Buyer:</strong> {selectedOrder.shippingAddress.fullName}
            </p>
            <p>
              <strong>Shipping Address:</strong>{" "}
              {selectedOrder.shippingAddress.fullName},{" "}
              {selectedOrder.shippingAddress.addressLine1},{" "}
              {selectedOrder.shippingAddress.city},{" "}
              {selectedOrder.shippingAddress.state},{" "}
              {selectedOrder.shippingAddress.postalCode},{" "}
              {selectedOrder.shippingAddress.country}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.shippingAddress.phone}
            </p>
            <p>
              <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
            </p>
            <p>
              <strong>Subtotal:</strong> ${selectedOrder.subtotal.toFixed(2)}
            </p>
            <p>
              <strong>Tax:</strong> ${selectedOrder.taxAmount.toFixed(2)}
            </p>
            <p>
              <strong>Shipping Charge:</strong> $
              {selectedOrder.shippingCharge.toFixed(2)}
            </p>
            <p>
              <strong>Total:</strong> ${selectedOrder.total.toFixed(2)}
            </p>
            <p>
              <strong>Ordered On:</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(selectedOrder.updatedAt).toLocaleString()}
            </p>

            <h3 className="mt-4 font-semibold">Items</h3>
            <ul className="list-disc pl-5">
              {selectedOrder.items.map(
                ({ productId, name, quantity, price }) => (
                  <li key={productId}>
                    {name} - Quantity: {quantity} - Price: ${price.toFixed(2)}
                  </li>
                )
              )}
            </ul>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
