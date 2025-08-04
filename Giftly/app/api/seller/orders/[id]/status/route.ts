import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').slice(-2, -1)[0];
      
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const orderRef = doc(db, 'orders', id);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Failed to update order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
