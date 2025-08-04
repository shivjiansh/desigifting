'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useCartStore from '@/store/cart'
import { toast } from 'sonner'
import { Navbar } from '@/components/ui/Navbar'
import ImageCarousel from '@/components/ui/ImageCarousel'

type Product = {
  _id: string
  name: string
  description: string
  price: number
  stock: number
  images?: string[]
  category: string
  sellerId?: string
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [customization, setCustomization] = useState('');


  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error('Failed to fetch product')
        const data = await res.json()
        setProduct(data.product)
      } catch (err: any) {
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProduct()
  }, [id])

  if (loading) return (
    <>
      <Navbar />
      <main className="flex items-center justify-center min-h-[70vh]">
        <p className="text-xl text-gray-500">Loading product...</p>
      </main>
    </>
  )

  if (error) return (
    <>
      <Navbar />
      <main className="flex items-center justify-center min-h-[70vh]">
        <p className="text-xl text-red-500">{error}</p>
      </main>
    </>
  )

  if (!product) return (
    <>
      <Navbar />
      <main className="flex items-center justify-center min-h-[70vh]">
        <p className="text-xl text-gray-500">Product not found</p>
      </main>
    </>
  )

  const handleAddToCart = () => {
    if (quantity < 1 || quantity > product.stock) {
      toast.error('Invalid quantity selected')
      return
    }
    addItem(product, quantity)
    toast.success(`${product.name} added to cart`)
    router.push('/cart')
  }

  return (
    <>
      <Navbar />

      <main className="container max-w-6xl py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10">{product.name}</h1>

        <div className="bg-white rounded-xl shadow-md flex flex-col md:flex-row gap-12 p-8">
          {/* Left: Image Carousel */}
          <section className="md:w-1/2 flex flex-col">
            {product.images && product.images.length > 0 ? (
              <ImageCarousel images={product.images} altPrefix={product.name} />
            ) : (
              <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}

            <div className="flex items-center justify-start mt-8 space-x-8">
              <span className="text-xl font-semibold text-primary-600">₹{product.price}</span>
              <span className={`text-lg font-medium ${product.stock === 0 ? 'text-red-500' : 'text-gray-600'}`}>
                {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
              </span>
            </div>
          </section>

          {/* Right: Description and Purchase */}
          <section className="md:w-1/2 flex flex-col justify-between">
            <div className="prose max-w-none prose-lg text-gray-700 mb-8 whitespace-pre-line">
              {product.description}
            </div>

            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-3 max-w-xs">
                <label htmlFor="quantity" className="block text-lg font-medium text-gray-700">
                  Quantity:
                </label>

                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="inline-flex items-center justify-center px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <input
                  type="number"
                  id="quantity"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(Math.max(1, Number(e.target.value) || 1), product.stock)
                    )
                  }
                  className="w-20 rounded-md border border-gray-300 px-3 py-1 text-center text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  aria-live="polite"
                  aria-atomic="true"
                />

                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="inline-flex items-center justify-center px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  aria-label="Increase quantity"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <div className="mb-6 max-w-xs">
                <label htmlFor="customization" className="block text-lg font-medium text-gray-700 mb-1">
                    Customization / Message for Seller:
                </label>
                <textarea
                    id="customization"
                    rows={4}
                    value={customization}
                    onChange={(e) => setCustomization(e.target.value)}
                    placeholder="Enter your customization or message here..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 resize-none"
                />
                </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-3 rounded-md text-white font-bold transition ${
                  product.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-400'
                }`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </section>
        </div>
      
      </main>
    </>
  )
}
