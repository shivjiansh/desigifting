// app/seller/products/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type Product = {
  name: string
  description: string
  price: number
  stock: number
  category: string
  images?: string[]
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id

  const [product, setProduct] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    images: [],
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const docRef = doc(db, 'products', productId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setProduct(docSnap.data() as Product)
        } else {
          setError('Product not found')
        }
      } catch (err) {
        setError('Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setProduct((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      if (!product.name.trim() || !product.description.trim() || !product.category.trim()) {
        setError('All fields are required')
        setSubmitting(false)
        return
      }
      if (product.price <= 0) {
        setError('Price must be greater than 0')
        setSubmitting(false)
        return
      }
      if (product.stock < 0) {
        setError('Stock cannot be negative')
        setSubmitting(false)
        return
      }

      const docRef = doc(db, 'products', productId)
      await updateDoc(docRef, {
        ...product,
        updatedAt: serverTimestamp(),
      })

      toast.success('Product updated successfully')
      router.push('/seller/products')
    } catch (err) {
      setError('Failed to update product')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p>Loading product...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <main className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            disabled 
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
            disabled 
            className="input w-full"
          >
            <option value="">Select Category</option>
            <option value="custom-mugs">Custom Mugs</option>
            <option value="photo-frames">Photo Frames</option>
            <option value="tshirts">T-Shirts</option>
            <option value="home-decor">Home Decor</option>
            <option value="stationery">Stationery</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step={0.01}
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={product.stock}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* You can add image management here too */}

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Product'}
        </Button>
      </form>
    </main>
  )
}
