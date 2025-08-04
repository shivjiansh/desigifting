// components/seller/SellerSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Star, 
  Settings,
  Users
} from 'lucide-react'

export function SellerSidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/seller/dashboard', icon: Home },
    { name: 'Products', href: '/seller/products', icon: Package },
    { name: 'Orders', href: '/seller/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/seller/customers', icon: Users },
    { name: 'Earnings', href: '/seller/earnings', icon: DollarSign },
    { name: 'Reviews', href: '/seller/reviews', icon: Star },
    { name: 'Settings', href: '/seller/settings', icon: Settings },
  ]

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-indigo-600">Giftly Seller</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors ${
                  pathname === item.href
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    pathname === item.href ? 'text-indigo-500' : 'text-gray-400'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}