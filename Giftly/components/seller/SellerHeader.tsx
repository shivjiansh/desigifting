// // components/seller/SellerHeader.tsx
// 'use client'

// import { useAuthStore } from '@/store/auth'
// import { Bell, User, LogOut } from 'lucide-react'
// import { DropdownMenu } from '@/components/ui/DropdownMenu'

// export function SellerHeader() {
//   const { user, logout } = useAuthStore()

//   return (
//     <div className="border-b border-gray-200 bg-white">
//       <div className="flex items-center justify-between px-4 py-3">
//         <div className="flex items-center">
//           <h2 className="text-lg font-medium text-gray-900">Seller Dashboard</h2>
//         </div>
        
//         <div className="flex items-center space-x-4">
//           <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
//             <Bell className="h-6 w-6" />
//           </button>
          
//           <DropdownMenu
//             trigger={
//               <button className="flex items-center space-x-2 focus:outline-none">
//                 <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
//                   <User className="h-5 w-5 text-indigo-600" />
//                 </div>
//                 <span className="text-sm font-medium text-gray-700">
//                   {user?.name}
//                 </span>
//               </button>
//             }
//             items={[
//               {
//                 label: 'Your Profile',
//                 onClick: () => window.location.href = '/seller/settings'
//               },
//               {
//                 label: 'Logout',
//                 icon: <LogOut className="h-4 w-4" />,
//                 onClick: logout
//               }
//             ]}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// components/seller/SellerHeader.tsx
'use client'

import  useAuthStore  from '@/store/auth'
import { Bell, User, LogOut, Settings } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/DropdownMenu'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'

interface DropdownItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
}

export function SellerHeader() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const dropdownItems: DropdownItem[] = [
    {
      label: 'Your Profile',
      icon: <User className="h-4 w-4" />,
      onClick: () => router.push('/seller/settings/profile')
    },
    {
      label: 'Account Settings',
      icon: <Settings className="h-4 w-4" />,
      onClick: () => router.push('/seller/settings/account')
    },
    {
      label: 'Logout',
      icon: <LogOut className="h-4 w-4" />,
      onClick: () => router.push('/')
    }
  ]

  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <h1 className="text-lg font-semibold text-gray-900">
          Seller Dashboard
        </h1>
        
        <div className="flex items-center gap-4">
          <button 
            aria-label="Notifications"
            className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center gap-2 focus:outline-none"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8">
                  {user?.avatar && (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  )}
                  <AvatarFallback className="bg-indigo-100 text-indigo-600">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  {user?.name || 'Account'}
                </span>
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              {dropdownItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={item.onClick}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}