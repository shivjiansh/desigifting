// app/seller/[sellerId]/page.tsx
import { doc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ImageCarousel from "@/components/ui/ImageCarousel";
import Link from "next/link";
import React from "react";
import SellerBranding from "@/components/seller/SellerBranding";
import SellerLogo from "@/components/seller/SellerLogo";

// Define product type
type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  images?: string[];
  category?: string;
};

// Props expected from params by Next.js App Router
interface SellerStorePageProps {
  params: {
    sellerId: string;
  };
}

// Server Component to fetch products by sellerId and render seller's storefront
export default async function SellerStorePage({
  params,
}: SellerStorePageProps) {
  const { sellerId } = params;

  // Query Firestore for products where sellerId matches param
  const productsRef = collection(db, "products");
  const q = query(productsRef, where("sellerId", "==", sellerId));
  const querySnapshot = await getDocs(q);

  const products: Product[] = querySnapshot.docs.map((doc) => ({
    _id: doc.id,
    ...doc.data(),
  })) as Product[];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-6 mb-8">
        <SellerLogo sellerId={sellerId} />
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Seller's Products
        </h1>
      </div>
      <div className="max-w-7xl mx-auto">
        <SellerBranding sellerId={sellerId} />

        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No products available from this seller at the moment.
          </p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col"
              >
                {product.images && product.images.length > 0 ? (
                  <ImageCarousel
                    images={product.images}
                    altPrefix={product.name}
                  />
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 flex-grow mt-2 line-clamp-3">
                    {product.description}
                  </p>
                  <p className="mt-4 font-bold text-primary-600 text-xl">
                    ₹{product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Stock: {product.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
