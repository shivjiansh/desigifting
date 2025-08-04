'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader } from "@/components/ui/Loader"; // your custom loader or replace with any spinner

type Category = {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const colRef = collection(db, "categories");
        const snapshot = await getDocs(colRef);
        const cats: Category[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Category, 'id'>)
        }));
        setCategories(cats);
      } catch (e) {
        setError("Failed to load categories.");
        console.error("Error fetching categories:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Categories</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.length === 0 ? (
          <p className="text-center col-span-full text-gray-600">No categories found.</p>
        ) : (
          categories.map(category => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="block rounded-lg border hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-w-4 aspect-h-3 relative rounded-t-lg overflow-hidden bg-gray-100">
                {category.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{category.name}</h2>
                {category.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{category.description}</p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>

  );
}
