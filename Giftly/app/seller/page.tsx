// 'use client';

// import { useEffect } from 'react';
// import Link from 'next/link';
// import useAuthStore from '@/store/auth';

// export default function SellerDashboard() {
//   const { user, checkAuth } = useAuthStore();

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white shadow">
//         <div className="container py-6">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Seller Dashboard
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Welcome back, {user?.name}! Manage your store and products
//           </p>
//         </div>
//       </div>

//       <div className="container py-8">
//         <div className="grid md:grid-cols-4 gap-6 mb-8">
//           {/* Stats Cards */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Total Products</p>
//                 <p className="text-2xl font-semibold text-gray-900">0</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Total Orders</p>
//                 <p className="text-2xl font-semibold text-gray-900">0</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Total Revenue</p>
//                 <p className="text-2xl font-semibold text-gray-900">$0</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Avg Rating</p>
//                 <p className="text-2xl font-semibold text-gray-900">0.0</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8">
//           {/* Quick Actions */}
//           <div className="md:col-span-2">
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//               <div className="grid sm:grid-cols-3 gap-4">
//                 <Link
//                   href="/seller/products/add"
//                   className="card p-4 hover:shadow-md transition-shadow text-center"
//                 >
//                   <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                     <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                     </svg>
//                   </div>
//                   <h3 className="font-medium">Add Product</h3>
//                   <p className="text-sm text-gray-600">List a new item</p>
//                 </Link>

//                 <Link
//                   href="/seller/orders"
//                   className="card p-4 hover:shadow-md transition-shadow text-center"
//                 >
//                   <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                     <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                     </svg>
//                   </div>
//                   <h3 className="font-medium">Manage Orders</h3>
//                   <p className="text-sm text-gray-600">Process sales</p>
//                 </Link>

//                 <Link
//                   href="/seller/products"
//                   className="card p-4 hover:shadow-md transition-shadow text-center"
//                 >
//                   <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
//                     <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                     </svg>
//                   </div>
//                   <h3 className="font-medium">My Products</h3>
//                   <p className="text-sm text-gray-600">View inventory</p>
//                 </Link>
//               </div>
//             </div>

//             {/* Recent Orders */}
//             <div className="bg-white rounded-lg shadow p-6 mt-6">
//               <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
//               <div className="text-center py-8 text-gray-500">
//                 <p>No recent orders</p>
//                 <p className="text-sm mt-2">Orders will appear here once customers start buying your products</p>
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="font-semibold mb-4">Store Status</h3>
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Store Active</span>
//                   <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                     ✓ Active
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Products Listed</span>
//                   <span className="font-medium">0</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Pending Orders</span>
//                   <span className="font-medium">0</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="font-semibold mb-4">Quick Links</h3>
//               <div className="space-y-2">
//                 <Link href="/seller/profile" className="block text-blue-600 hover:underline">
//                   Store Settings
//                 </Link>
//                 <Link href="/seller/earnings" className="block text-blue-600 hover:underline">
//                   Earnings Report
//                 </Link>
//                 <Link href="/seller/reviews" className="block text-blue-600 hover:underline">
//                   Customer Reviews
//                 </Link>
//                 <Link href="/public/contact" className="block text-blue-600 hover:underline">
//                   Seller Support
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// app/seller/page.tsx
import { StatsCards } from '@/components/seller/StatsCards'
import { RecentOrders } from '@/components/seller/RecentOrders'
import { SalesChart } from '@/components/seller/SalesChart'

export default function SellerDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        
        <div className="lg:col-span-1">
          <RecentOrders />
        </div>
      </div>
    </div>
  )
}