// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import useAuthStore from '@/store/auth';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';

// import { db, storage } from '@/lib/firebase';
// import {
//   collection,
//   addDoc,
//   serverTimestamp,
//   updateDoc
// } from 'firebase/firestore';
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL
// } from 'firebase/storage';

// export default function AddProductPage() {
//   const router = useRouter();
//   const { user } = useAuthStore();

//   const [product, setProduct] = useState({
//     name: '',
//     description: '',
//     price: '',
//     stock: '',
//     images: [] as File[],
//     category: '',
//     sellerId: user?.id || '',
//     sellerName: user?.name || '',
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setProduct((prev) => ({
//         ...prev,
//         images: [...prev.images, ...files],
//       }));
//     }
//   };

//   const removeImage = (index: number) => {
//     setProduct((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));
//   };

//   const validateForm = () => {
//     if (!product.name.trim()) return 'Product name is required.';
//     if (!product.category.trim()) return 'Category is required.';
//     if (!product.description.trim()) return 'Description is required.';
//     const priceNum = parseFloat(product.price);
//     if (isNaN(priceNum) || priceNum <= 0) return 'Price must be greater than 0.';
//     const stockNum = parseInt(product.stock);
//     if (isNaN(stockNum) || stockNum < 0) return 'Stock quantity must be 0 or more.';
//     if (product.images.length === 0) return 'At least one product image is required.';
//     return '';
//   };

//   const uploadImageToFirebase = async (file: File, productId: string): Promise<string> => {
//     const storageRef = ref(storage, `products/${productId}/${file.name}_${Date.now()}`);
//     await uploadBytes(storageRef, file);
//     const url = await getDownloadURL(storageRef);
//     return url;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const errorMsg = validateForm();
//     if (errorMsg) {
//       toast.error(errorMsg);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       // First, add product metadata without images so we can get an ID
// const productRef = await addDoc(collection(db, 'products'), {
//   name: product.name.trim(),
//   description: product.description.trim(),
//   price: parseFloat(product.price),
//   stock: parseInt(product.stock),
//   category: product.category.trim(),
//   sellerId: product.sellerId,
//   sellerName: product.sellerName,
//   images: [], // placeholder
//   createdAt: serverTimestamp(),
// });

// const imageUrls = await Promise.all(
//   product.images.map((file) => uploadImageToFirebase(file, productRef.id))
// );

// await updateDoc(productRef, {
//   images: imageUrls,
// });

//       toast.success('Product created successfully!');
//       router.push('/seller/products');
//     } catch (error) {
//       toast.error('Error creating product');
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <main className="max-w-xl mx-auto py-10 px-4">
//       <h1 className="text-2xl font-bold mb-8">Add New Product</h1>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="space-y-2">
//           <Label htmlFor="name">Product Name</Label>
//           <Input
//             id="name"
//             value={product.name}
//             onChange={(e) => setProduct({ ...product, name: e.target.value })}
//             required
//             autoComplete="off"
//           />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="category">Category</Label>
//           <select
//             id="category"
//             value={product.category}
//             onChange={(e) => setProduct({ ...product, category: e.target.value })}
//             required
//             className="input w-full"
//           >
//             <option value="">Select Category</option>
//             <option value="custom-mugs">Custom Mugs</option>
//             <option value="photo-frames">Photo Frames</option>
//             <option value="tshirts">T-Shirts</option>
//             <option value="home-decor">Home Decor</option>
//             <option value="stationery">Stationery</option>
//             <option value="others">Others</option>
//             {/* Extend as needed */}
//           </select>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="description">Description</Label>
//           <Textarea
//             id="description"
//             value={product.description}
//             onChange={(e) => setProduct({ ...product, description: e.target.value })}
//             required
//             rows={5}
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="price">Price (₹)</Label>
//             <Input
//               id="price"
//               type="number"
//               step="0.01"
//               min="0.01"
//               value={product.price}
//               onChange={(e) => setProduct({ ...product, price: e.target.value })}
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="stock">Stock Quantity</Label>
//             <Input
//               id="stock"
//               type="number"
//               min="0"
//               value={product.stock}
//               onChange={(e) => setProduct({ ...product, stock: e.target.value })}
//               required
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="images">Product Images</Label>
//           <Input
//             id="images"
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={handleImageChange}
//           />
//           <div className="flex flex-wrap gap-2 mt-2">
//             {product.images.map((file, index) => (
//               <div key={index} className="relative group">
//                 <img
//                   src={URL.createObjectURL(file)}
//                   alt={`Preview ${index + 1}`}
//                   className="h-20 w-20 object-cover rounded"
//                   onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeImage(index)}
//                   className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
//                   aria-label={`Remove image ${index + 1}`}
//                 >
//                   ×
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <Button type="submit" disabled={isSubmitting}>
//           {isSubmitting ? 'Creating...' : 'Create Product'}
//         </Button>
//       </form>
//     </main>
//   );
// }


// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import useAuthStore from '@/store/auth';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';

// import { db, storage } from '@/lib/firebase';
// import {
//   collection,
//   addDoc,
//   serverTimestamp,
//   updateDoc
// } from 'firebase/firestore';
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL
// } from 'firebase/storage';

// export default function AddProductPage() {
//   const router = useRouter();
//   const { user } = useAuthStore();

//   const [product, setProduct] = useState({
//     name: '',
//     description: '',
//     price: '',
//     stock: '',
//     images: [] as File[],
//     category: '',
//     sellerId: user?.id || '',
//     sellerName: user?.name || '',
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setProduct((prev) => ({
//         ...prev,
//         images: [...prev.images, ...files],
//       }));
//     }
//   };

//   const removeImage = (index: number) => {
//     setProduct((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));
//   };

//   const validateForm = () => {
//     if (!product.name.trim()) return 'Product name is required.';
//     if (!product.category.trim()) return 'Category is required.';
//     if (!product.description.trim()) return 'Description is required.';
//     const priceNum = parseFloat(product.price);
//     if (isNaN(priceNum) || priceNum <= 0) return 'Price must be greater than 0.';
//     const stockNum = parseInt(product.stock);
//     if (isNaN(stockNum) || stockNum < 0) return 'Stock quantity must be 0 or more.';
//     if (product.images.length === 0) return 'At least one product image is required.';
//     return '';
//   };

//   const uploadImageToFirebase = async (file: File, productId: string): Promise<string> => {
//     const storageRef = ref(storage, `products/${productId}/${file.name}_${Date.now()}`);
//     await uploadBytes(storageRef, file);
//     const url = await getDownloadURL(storageRef);
//     return url;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const errorMsg = validateForm();
//     if (errorMsg) {
//       toast.error(errorMsg);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       // Add product metadata (without images first)
//       const productRef = await addDoc(collection(db, 'products'), {
//         name: product.name.trim(),
//         description: product.description.trim(),
//         price: parseFloat(product.price),
//         stock: parseInt(product.stock),
//         category: product.category.trim(),
//         sellerId: product.sellerId,
//         sellerName: product.sellerName,
//         images: [],
//         createdAt: serverTimestamp(),
//       });

//       // Upload all images and get their URLs
//       const imageUrls = await Promise.all(
//         product.images.map((file) => uploadImageToFirebase(file, productRef.id))
//       );

//       // Update product document with image URLs
//       await updateDoc(productRef, {
//         images: imageUrls,
//       });

//       toast.success('Product created successfully!');
//       router.push('/seller/products');
//     } catch (error) {
//       toast.error('Error creating product');
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <main className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-3xl font-semibold mb-8 text-gray-900">Add New Product</h1>
//       <form onSubmit={handleSubmit} className="space-y-8">
//         {/* Product Name */}
//         <div>
//           <Label htmlFor="name" className="block mb-2 font-medium text-gray-700">Product Name</Label>
//           <Input
//             id="name"
//             type="text"
//             value={product.name}
//             onChange={(e) => setProduct({ ...product, name: e.target.value })}
//             placeholder="Enter product name"
//             required
//             className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
//           />
//         </div>

//         {/* Category */}
//         <div>
//           <Label htmlFor="category" className="block mb-2 font-medium text-gray-700">Category</Label>
//           <select
//             id="category"
//             value={product.category}
//             onChange={(e) => setProduct({ ...product, category: e.target.value })}
//             required
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
//           >
//             <option value="" disabled>Select category</option>
//             <option value="custom-mugs">Custom Mugs</option>
//             <option value="photo-frames">Photo Frames</option>
//             <option value="tshirts">T-Shirts</option>
//             <option value="home-decor">Home Decor</option>
//             <option value="stationery">Stationery</option>
//             <option value="others">Others</option>
//           </select>
//         </div>

//         {/* Description */}
//         <div>
//           <Label htmlFor="description" className="block mb-2 font-medium text-gray-700">Description</Label>
//           <Textarea
//             id="description"
//             value={product.description}
//             onChange={(e) => setProduct({ ...product, description: e.target.value })}
//             rows={5}
//             placeholder="Describe your product"
//             required
//             className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 resize-none"
//           />
//         </div>

//         {/* Price and Stock */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <div>
//             <Label htmlFor="price" className="block mb-2 font-medium text-gray-700">Price (₹)</Label>
//             <Input
//               id="price"
//               type="number"
//               step="0.01"
//               min="0.01"
//               value={product.price}
//               onChange={(e) => setProduct({ ...product, price: e.target.value })}
//               placeholder="0.00"
//               required
//               className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
//             />
//           </div>
//           <div>
//             <Label htmlFor="stock" className="block mb-2 font-medium text-gray-700">Stock Quantity</Label>
//             <Input
//               id="stock"
//               type="number"
//               min="0"
//               value={product.stock}
//               onChange={(e) => setProduct({ ...product, stock: e.target.value })}
//               placeholder="0"
//               required
//               className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
//             />
//           </div>
//         </div>

//         {/* Images Upload */}
//         <div>
//           <Label htmlFor="images" className="block mb-2 font-medium text-gray-700">Product Images</Label>
//           <Input
//             id="images"
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={handleImageChange}
//             className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//           />

//           {/* Image Preview */}
//           {product.images.length > 0 && (
//             <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-4">
//               {product.images.map((file, index) => (
//                 <div
//                   key={index}
//                   className="relative h-28 rounded-lg overflow-hidden border border-gray-300 shadow-sm group"
//                 >
//                   <img
//                     src={URL.createObjectURL(file)}
//                     alt={`Preview ${index + 1}`}
//                     className="object-cover w-full h-full"
//                     onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
//                   />
//                   <button
//                     type="button"
//                     aria-label={`Remove image ${index + 1}`}
//                     onClick={() => removeImage(index)}
//                     className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Submit Button */}
//         <div>
//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full flex justify-center items-center gap-2"
//           >
//             {isSubmitting && (
//               <svg
//                 className="animate-spin h-5 w-5 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v8z"
//                 ></path>
//               </svg>
//             )}
//             {isSubmitting ? 'Creating...' : 'Create Product'}
//           </Button>
//         </div>
//       </form>
//     </main>
//   );
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
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';


const CLOUDINARY_UPLOAD_PRESET = 'kuuyuxlp';
const CLOUDINARY_CLOUD_NAME = 'dxs7yunib';

async function uploadImage(file: File): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Cloudinary upload error:', errorText);
    throw new Error(`Image upload failed: ${errorText}`);
  }

  const data = await response.json();
  return data.secure_url;
}

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
    if (!user) return 'User authentication required.';
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

      // Upload images to Cloudinary
      const imageUrls = await Promise.all(product.images.map(file => uploadImage(file)));

      // Send product info with image URLs to backend API
      if(!user) {
  toast.error('You must be logged in to add a product.');
  return;
}
      const requestData = {
  name: product.name.trim(),
  description: product.description.trim(),
  price: parseFloat(product.price),
  stock: parseInt(product.stock),
  category: product.category.trim(),
  images: imageUrls,
  sellerId: user.uid,
  sellerName: user.name,
};

console.log('Request JSON:', JSON.stringify(requestData, null, 2));

const response = await fetch('/api/seller/products', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(requestData),
});

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      toast.success('Product created successfully!');
      router.push('/seller/products');
    } catch (error: any) {
      toast.error(error.message || 'Error creating product');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-8 text-gray-900">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Product Name */}
        <div>
          <Label htmlFor="name" className="block mb-2 font-medium text-gray-700">
            Product Name
          </Label>
          <Input
            id="name"
            type="text"
            value={product.name}
            onChange={e => setProduct({ ...product, name: e.target.value })}
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category" className="block mb-2 font-medium text-gray-700">
            Category
          </Label>
          <select
            id="category"
            value={product.category}
            onChange={e => setProduct({ ...product, category: e.target.value })}
            required
            className="input w-full"
          >
            <option value="">Select category</option>
            <option value="custom-mugs">Custom Mugs</option>
            <option value="photo-frames">Photo Frames</option>
            <option value="tshirts">T-Shirts</option>
            <option value="home-decor">Home Decor</option>
            <option value="stationery">Stationery</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="block mb-2 font-medium text-gray-700">
            Description
          </Label>
          <Textarea
            id="description"
            value={product.description}
            onChange={e => setProduct({ ...product, description: e.target.value })}
            rows={5}
            placeholder="Describe your product"
            required
          />
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="price" className="block mb-2 font-medium text-gray-700">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              value={product.price}
              onChange={e => setProduct({ ...product, price: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <Label htmlFor="stock" className="block mb-2 font-medium text-gray-700">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={product.stock}
              onChange={e => setProduct({ ...product, stock: e.target.value })}
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Images Upload */}
        <div>
          <Label htmlFor="images" className="block mb-2 font-medium text-gray-700">Product Images</Label>
          <Input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />

          {/* Image Preview */}
          {product.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-4">
              {product.images.map((file, idx) => (
                <div
                  key={idx}
                  className="relative h-28 rounded-lg overflow-hidden border border-gray-300 shadow-sm group"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${idx + 1}`}
                    className="object-cover w-full h-full"
                    onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                  />
                  <button
                    type="button"
                    aria-label={`Remove image ${idx + 1}`}
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </main>
  );
}
