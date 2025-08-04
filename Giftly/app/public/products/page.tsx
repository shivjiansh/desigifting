'use client'

import { useEffect, useState, useMemo } from 'react'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import ImageCarousel from '@/components/ui/ImageCarousel'
import Link from 'next/link'
import { BuyerNavbar } from '@/components/ui/BuyerNavbar'
import { Loader } from '@/components/ui/Loader';


type Product = {
  _id: string
  name: string
  description?: string
  price: number
  stock: number
  images?: string[] // image URLs
  sellerId?: string
  category?: string
}

type Category = {
  _id: string
  value: string
  label: string
}

type SortOption = 'priceAsc' | 'priceDesc' | ''

const PRODUCTS_PER_PAGE = 12

export default function ProductsPage() {
  // Data states
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Filter, sort and pagination state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOption>('')
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch products
  useEffect(() => {
    setLoading(true)
    fetch('/api/products')
      .then(async (res) => {
        if (!res.ok) {
          const { message } = await res.json().catch(() => ({}))
          throw new Error(message || 'Failed to fetch products')
        }
        return res.json()
      })
      .then((data) => {
        setProducts(data.products || [])
        setError(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Fetch categories
  useEffect(() => {
    setLoadingCategories(true)
    fetch('/api/categories')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await res.json()
        setCategories(data.categories || [])
      })
      .catch((err) => {
        console.error(err)
        setCategories([])
      })
      .finally(() => setLoadingCategories(false))
  }, [])

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Search filter by product name
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(lowerSearch)
      )
    }

    // Sorting
    if (sortOrder === 'priceAsc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortOrder === 'priceDesc') {
      filtered.sort((a, b) => b.price - a.price)
    }

    return filtered
  }, [products, selectedCategory, searchTerm, sortOrder])

  // Pagination slice
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
    const endIndex = startIndex + PRODUCTS_PER_PAGE
    return filteredProducts.slice(startIndex, endIndex)
  }, [filteredProducts, currentPage])

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)

  // Reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, sortOrder])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <BuyerNavbar />

      <div className="container py-8 flex flex-col md:flex-row gap-6 flex-1">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-lg shadow p-6 sticky top-20 self-start h-fit">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Categories</h2>
            {loadingCategories ? (
              <p>Loading categories...</p>
            ) : (
              <ul className="space-y-2 text-gray-700">
                <li>
                  <button
                    className={`block w-full text-left px-3 py-1 rounded ${
                      selectedCategory === ''
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCategory('')}
                    type="button"
                  >
                    All Categories
                  </button>
                </li>
                {categories.map(({ value, label }) => (
                  <li key={value}>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(value)}
                      className={`block w-full text-left px-3 py-1 rounded ${
                        selectedCategory === value
                          ? 'bg-primary-600 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Sort by Price</h2>
            <select
              className="input w-full"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOption)}
              aria-label="Sort products by price"
            >
              <option value="">None</option>
              <option value="priceAsc">Low to High</option>
              <option value="priceDesc">High to Low</option>
            </select>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="mb-6">
            <input
              type="search"
              placeholder="Search products..."
              className="input w-full md:w-1/2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search products"
            />
          </div>

          {loading ? (
             <Loader />
          ) : error ? (
            <div className="text-center py-16 text-red-500">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Products Found
              </h2>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <Link
                    key={product._id}
                    href={`/public/products/${product._id}`}
                    className="block bg-white p-4 rounded-lg shadow hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    aria-label={`View details for ${product.name}`}
                  >
                    {product.images && product.images.length > 0 && (
                      <ImageCarousel
                        images={product.images}
                        altPrefix={product.name}
                      />
                    )}
                    <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                    <p className="text-gray-700 font-medium">
                      From: {product.sellerName || 'Unknown Seller'}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-primary-600 font-bold">
                        ${product.price}
                      </span>
                      <span className="text-xs text-gray-400">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
                >
                  Previous
                </button>
                <span className="px-4 py-2 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
