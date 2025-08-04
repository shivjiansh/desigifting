'use client';

import React from 'react';
import Link from 'next/link';

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-lg shadow-md text-center">
        <svg
          className="mx-auto mb-6 h-16 w-16 text-yellow-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
          />
        </svg>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Seller Application Received</h1>
        <p className="text-gray-700 mb-6">
          Thank you for registering as a seller on Giftly! Your application is currently under review.
        </p>
        <p className="text-gray-700 mb-6">
          We will notify you via email once your account has been approved. This typically takes 1 to 3 business days.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
