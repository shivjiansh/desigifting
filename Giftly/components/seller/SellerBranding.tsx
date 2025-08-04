'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type SellerBrandingProps = {
  sellerId: string;
};

export default function SellerBranding({ sellerId }: SellerBrandingProps) {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSellerBranding() {
      const sellerDoc = await getDoc(doc(db, 'sellers', sellerId));
      if (sellerDoc.exists()) {
        const data = sellerDoc.data();
        setBannerUrl(data.bannerUrl ?? null);
        setLogoUrl(data.logoUrl ?? null);
      }
    }
    fetchSellerBranding();
  }, [sellerId]);

  return (
    <div className="relative mb-12">
  {/* Banner */}
  <div className="w-full h-48 md:h-72 bg-gray-200 overflow-hidden rounded-lg">
    {bannerUrl ? (
      <img
        src={bannerUrl}
        alt="Seller Banner"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        No Banner
      </div>
    )}
  </div>

  {/* Circular Logo - shifted to bottom left, overlapping banner */}
  {/* <div
    className="
      absolute 
      left-0 bottom-0
      -translate-x-1/2 translate-y-1/4
      w-32 h-32
      rounded-full border-4 border-white
      bg-gray-100 overflow-hidden shadow-lg
      flex items-center justify-center z-10
    "
    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
  >
    {logoUrl ? (
      <img
        src={logoUrl}
        alt="Seller Logo"
        className="w-full h-full object-cover rounded-full"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        No Logo
      </div>
    )}
  </div> */}
</div>

  );
}
