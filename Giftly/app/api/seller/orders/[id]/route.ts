// app/api/seller/orders/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const sellerId = url.searchParams.get('sellerId')
    if (!sellerId) {
      return NextResponse.json({ error: 'Missing sellerId' }, { status: 400 })
    }

    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, where('sellerId', '==', sellerId), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)

    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Failed to fetch orders', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
