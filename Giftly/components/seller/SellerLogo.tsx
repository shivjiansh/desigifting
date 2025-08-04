'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function SellerLogo({ sellerId }: { sellerId: string }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogo() {
      const sellerDoc = await getDoc(doc(db, 'sellers', sellerId));
      if (sellerDoc.exists()) setLogoUrl(sellerDoc.data().logoUrl ?? null);
    }
    fetchLogo();
  }, [sellerId]);

  return (
    <div className="flex justify-center mb-6">
      <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-gray-100 overflow-hidden">
        {logoUrl ? (
          <img src={logoUrl} alt="Seller Logo" className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Logo</div>
        )}
      </div>
    </div>
  );
}
