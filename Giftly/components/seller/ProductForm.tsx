// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Label } from '@/components/ui/label'
// import { useAuthStore } from '@/store/auth'
// import { toast } from 'sonner'

// export function ProductForm() {
//   const [product, setProduct] = useState({
//     name: '',
//     description: '',
//     price: '',
//     stock: '',
//     images: [] as File[],
//   })
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const router = useRouter()
//   const { user } = useAuthStore()

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files)
//       setProduct({ ...product, images: [...product.images, ...files] })
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     try {
//       const formData = new FormData()
//       formData.append('name', product.name)
//       formData.append('description', product.description)
//       formData.append('price', product.price)
//       formData.append('stock', product.stock)
//       formData.append('sellerId', user?.id || '')
//       // product.images.forEach((file) => {
//       //    formData.append('images', file)
//       // })

//       const response = await fetch('/api/seller/products', {
//         method: 'POST',
//         body: formData,
//       })

//       if (!response.ok) throw new Error('Failed to create product')

//       toast.success('Product created successfully!')
//       router.push('/seller/products')
//     } catch (error) {
//       toast.error('Error creating product')
//       console.error(error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-2">
//         <Label htmlFor="name">Product Name</Label>
//         <Input
//           id="name"
//           value={product.name}
//           onChange={(e) => setProduct({ ...product, name: e.target.value })}
//           required
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="description">Description</Label>
//         <Textarea
//           id="description"
//           value={product.description}
//           onChange={(e) => setProduct({ ...product, description: e.target.value })}
//           required
//           rows={5}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="price">Price ($)</Label>
//           <Input
//             id="price"
//             type="number"
//             min="0.01"
//             step="0.01"
//             value={product.price}
//             onChange={(e) => setProduct({ ...product, price: e.target.value })}
//             required
//           />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="stock">Stock Quantity</Label>
//           <Input
//             id="stock"
//             type="number"
//             min="1"
//             value={product.stock}
//             onChange={(e) => setProduct({ ...product, stock: e.target.value })}
//             required
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="images">Product Images</Label>
//         <Input
//           id="images"
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={handleImageChange}
//         />
//         <div className="flex flex-wrap gap-2 mt-2">
//           {product.images.map((file, index) => (
//             <div key={index} className="relative">
//               <img
//                 src={URL.createObjectURL(file)}
//                 alt={`Preview ${index}`}
//                 className="h-20 w-20 object-cover rounded"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       <Button type="submit" disabled={isSubmitting}>
//         {isSubmitting ? 'Creating...' : 'Create Product'}
//       </Button>
//     </form>
//   )
// }
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AddProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    images: [] as File[],
    category: '',
    sellerId: user?.id || '',
    sellerName: user?.name || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
    }
  };

  const removeImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!product.name.trim()) return 'Product name is required.';
    if (!product.category.trim()) return 'Category is required.';
    if (!product.description.trim()) return 'Description is required.';
    const priceNum = parseFloat(product.price);
    if (isNaN(priceNum) || priceNum <= 0) return 'Price must be greater than 0.';
    const stockNum = parseInt(product.stock);
    if (isNaN(stockNum) || stockNum < 0) return 'Stock quantity must be 0 or more.';
    if (product.images.length === 0) return 'At least one product image is required.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMsg = validateForm();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('stock', product.stock);
      formData.append('category', product.category);
      formData.append('sellerId', product.sellerId);
      formData.append('sellerName', product.sellerName);

      product.images.forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch('/api/seller/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to create product');

      toast.success('Product created successfully!');
      router.push('/seller/products');
    } catch (error) {
      toast.error('Error creating product');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-8">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            required
            className="input w-full"
          >
            <option value="">Select Category</option>
            <option value="custom-mugs">Custom Mugs</option>
            <option value="photo-frames">Photo Frames</option>
            <option value="tshirts">T-Shirts</option>
            <option value="home-decor">Home Decor</option>
            <option value="stationery">Stationery</option>
            <option value="others">Others</option>
            {/* Extend as needed */}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            required
            rows={5}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={product.stock}
              onChange={(e) => setProduct({ ...product, stock: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="images">Product Images</Label>
          <Input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {product.images.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="h-20 w-20 object-cover rounded"
                  onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                  aria-label={`Remove image ${index + 1}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </Button>
      </form>
    </main>
  );
}
