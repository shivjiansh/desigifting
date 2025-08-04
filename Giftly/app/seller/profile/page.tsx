"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import useAuthStore from "@/store/auth";
import { toast } from "sonner";
import axios from 'axios';


type SellerProfileData = {
  storeName: string;
  description: string;
  phone?: string;
  email: string;
  logoUrl?: string;
  bannerUrl?: string;
  address?: string;
  website?: string;
  isApproved: boolean;
  ratings?: number;
  totalProducts?: number;
  totalSales?: number;
};

export default function SellerProfilePage() {
  const user = useAuthStore((state) => state.user);

  const [profile, setProfile] = useState<SellerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      setLoading(true);
      try {
        const sellerDoc = await getDoc(doc(db, "sellers", user.uid));
        if (sellerDoc.exists()) {
          const data = sellerDoc.data() as SellerProfileData;
          setProfile({
            email: user.email ?? "",
            phone: user.phone ?? "",
            ...data,
          });
          if (data.logoUrl) setPreviewLogo(data.logoUrl);
          if (data.bannerUrl) setPreviewBanner(data.bannerUrl);
        } else {
          setProfile({
            storeName: "",
            description: "",
            email: user.email ?? "",
            phone: user.phone ?? "",
            isApproved: false,
            ratings: 0,
            totalProducts: 0,
            totalSales: 0,
          });
        }
      } catch (error) {
        toast.error("Failed to load seller profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setProfile((p) => (p ? { ...p, [name]: value } : null));
  }

  // Logo
  function onSelectLogo(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setLogoFile(e.target.files[0]);
      setPreviewLogo(URL.createObjectURL(e.target.files[0]));
    }
  }

  // Banner
  function onSelectBanner(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setBannerFile(e.target.files[0]);
      setPreviewBanner(URL.createObjectURL(e.target.files[0]));
    }
  }

  async function uploadImage(file: File, path: string) {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
  async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'kuuyuxlp');

  const { data } = await axios.post('https://api.cloudinary.com/v1_1/dxs7yunib/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.secure_url; // The hosted image URL
}

  // Save all updates
  async function handleSave() {
  if (!profile || !user) return;
  if (!profile.storeName.trim()) {
    toast.error("Store name is required");
    return;
  }
  if (!profile.description.trim()) {
    toast.error("Store description is required");
    return;
  }

  setSaving(true);
  try {
// Inside handleSave before setDoc call
const updates: Partial<SellerProfileData> = {
  storeName: profile.storeName.trim(),
  description: profile.description.trim(),
  phone: profile.phone?.trim(),
  address: profile.address?.trim(),
  website: profile.website ? profile.website.trim() : "null", // set to null if empty
  updatedAt: serverTimestamp(),
};

    // Upload images to Cloudinary
    if (logoFile) {
      toast("Uploading logo...");
      const logoUrl = await uploadToCloudinary(logoFile);
      updates.logoUrl = logoUrl;
    }
    if (bannerFile) {
      toast("Uploading banner...");
      const bannerUrl = await uploadToCloudinary(bannerFile);
      updates.bannerUrl = bannerUrl;
    }

    function cleanData<T>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined)
  ) as Partial<T>;
}



// Remove undefined fields
const cleanedUpdates = cleanData(updates);

    await setDoc(
      doc(db, "sellers", user.uid),
      { ...updates, isApproved: profile.isApproved },
      { merge: true }
    );

    toast.success("Profile updated successfully!");
    setLogoFile(null);
    setBannerFile(null);
  } catch (error) {
    toast.error("Failed to save profile");
    console.error(error);
  } finally {
    setSaving(false);
  }
}

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-red-600 text-lg">Failed to load profile data.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Seller Profile</h1>

      <section aria-label="Seller Status" className="mb-6">
        <p
          className="inline-block px-3 py-1 rounded-md text-sm font-semibold 
          text-white 
          bg-green-600 dark:bg-green-500"
        >
          {profile.isApproved ? "Approved Seller" : "Pending Approval"}
        </p>
      </section>

      <section
        aria-label="Profile Management"
        className="bg-white p-6 rounded-md shadow-md mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">Store Information</h2>

        {/* Banner */}
        <div className="mb-6">
          <p className="font-medium mb-2">Store Banner</p>
          <div className="w-full h-52 rounded-md border border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
            {previewBanner ? (
              <img
                src={previewBanner}
                alt="Store banner"
                className="object-cover w-full h-full"
              />
            ) : (
              <p className="text-gray-400">No Banner</p>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={onSelectBanner}
            className="mt-2"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <p className="font-medium mb-2">Store Logo</p>
            <div className="w-32 h-32 rounded-md border border-gray-300 overflow-hidden bg-gray-100">
              {previewLogo ? (
                <img
                  src={previewLogo}
                  alt="Store logo"
                  className="object-cover w-full h-full"
                />
              ) : (
                <p className="text-gray-400 flex items-center justify-center h-full">
                  No Logo
                </p>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={onSelectLogo}
              className="mt-2"
            />
          </div>

          {/* Store Meta Info */}
          <div className="flex-grow">
            <label htmlFor="storeName" className="block font-medium mb-1">
              Store Name
            </label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={profile.storeName}
              onChange={handleChange}
              className={`input w-full ${
                profile.storeName.trim() === "" ? "border-red-500" : ""
              }`}
              required
            />

            <label
              htmlFor="description"
              className="block font-medium mt-4 mb-1"
            >
              Store Description
            </label>
            <textarea
              id="description"
              name="description"
              value={profile.description ?? ""}
              onChange={handleChange}
              className={`input w-full resize-y ${
                (profile.description ?? "").trim() === ""
                  ? "border-red-500"
                  : ""
              }`}
              rows={4}
              required
            />
          </div>
        </div>

        <hr className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone ?? ""}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email (read-only)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              readOnly
              disabled
              className="input w-full bg-gray-100"
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="address" className="block font-medium mb-1">
            Business Address
          </label>
          <textarea
            id="address"
            name="address"
            value={profile.address ?? ""}
            onChange={handleChange}
            className="input w-full resize-y"
            rows={3}
          />
        </div>

        <div className="mt-10">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`btn-primary px-6 py-3 font-semibold ${
              saving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </section>

      <section
        aria-label="Seller Overview Stats"
        className="bg-white p-6 rounded-md shadow-md max-w-4xl mx-auto"
      >
        <h2 className="text-xl font-semibold mb-4">Store Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold">{profile.totalProducts ?? 0}</p>
            <p className="text-gray-600">Products</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{profile.totalSales ?? 0}</p>
            <p className="text-gray-600">Total Sales</p>
          </div>
          <div>
            <p className="text-3xl font-bold">
              {profile.ratings?.toFixed(1) ?? "0.0"} / 5
            </p>
            <p className="text-gray-600">Ratings</p>
          </div>
        </div>
      </section>
    </div>
  );
}
