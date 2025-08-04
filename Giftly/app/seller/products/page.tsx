'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth';
import ImageCarousel from '@/components/ui/ImageCarousel';
import { toast } from 'sonner';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: string[];
};

export default function SellerProductsPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/seller/products?sellerId=${user.uid}`)
      .then(async (res) => {
        if (!res.ok) {
          const { message } = await res.json().catch(() => ({}));
          throw new Error(message || 'Failed to fetch products');
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  async function handleDelete(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeletingProductId(productId);
    try {
      const response = await fetch(`/api/seller/products/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const { error } = await response.json().catch(() => ({}));
        throw new Error(error || 'Failed to delete product');
      }
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success('Product deleted successfully');
    } catch (e: any) {
      toast.error(e.message || 'Error deleting product');
    } finally {
      setDeletingProductId(null);
    }
  }

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Products</h1>

        {products.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No products listed yet</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded shadow flex flex-col">
                {product.images && product.images.length > 0 && (
                  <ImageCarousel images={product.images} altPrefix={product.name} />
                )}

                <h2 className="font-semibold text-xl">{product.name}</h2>
                <p className="text-gray-700">{product.description}</p>
                <p className="mt-2 font-bold">${product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => router.push(`/seller/products/${product._id}/edit`)}
                  >
                    Edit
                  </button>

                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center justify-center"
                    onClick={() => handleDelete(product._id)}
                    disabled={deletingProductId === product._id}
                    aria-label="Delete product"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
