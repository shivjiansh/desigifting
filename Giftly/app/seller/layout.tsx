// app/seller/layout.tsx
import { SellerSidebar } from '@/components/seller/SellerSidebar'
import { SellerHeader } from '@/components/seller/SellerHeader'

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <SellerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}