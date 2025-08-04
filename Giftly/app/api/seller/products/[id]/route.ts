import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function DELETE(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const parts = pathname.split('/');
    const productId = parts[parts.length - 1];

    if (!productId) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    const productRef = doc(db, 'products', productId);

    // Optional: Add authorization check here, e.g., verify user owns the product

    await deleteDoc(productRef);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
