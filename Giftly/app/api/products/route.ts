import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export async function GET(request: Request) {
  try {
    const productsCol = collection(db, 'products')
    const productsSnapshot = await getDocs(productsCol)
    const products = productsSnapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Failed to fetch products', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
