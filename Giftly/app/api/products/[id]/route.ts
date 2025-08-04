// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const pathname = url.pathname
    const id = pathname.split('/').pop()
    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID required' }, { status: 400 })
    }

    const productRef = doc(db, 'products', id)
    const productSnap = await getDoc(productRef)

    if (!productSnap.exists()) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 })
    }

    const product = { id: productSnap.id, ...productSnap.data() }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
