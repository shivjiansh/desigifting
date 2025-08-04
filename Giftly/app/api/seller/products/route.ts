import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { query, where, getDocs } from 'firebase/firestore'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sellerId = searchParams.get('sellerId')

  if (!sellerId) {
    return NextResponse.json({ error: 'Missing sellerId' }, { status: 400 })
  }

  try {
    const productsQuery = query(collection(db, 'products'), where('sellerId', '==', sellerId))
    const querySnapshot = await getDocs(productsQuery)

    const products = querySnapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ products })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
 
    const body = await req.json();
    console.log('Received body:', body);

    const {
      name,
      description,
      price,
      stock,
      category,
      images,
      sellerId,
      sellerName,
    } = body;

    if (!name || !description || !price || !stock || !category || !images?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const productRef = await addDoc(collection(db, 'products'), {
      name,
      description,
      price,
      stock,
      category,
      images,
      sellerId,
      sellerName,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ message: 'Product created', id: productRef.id });
  } catch (error) {
    console.error('Error parsing request JSON:', error);
    return NextResponse.json({ error: 'Failed to create productss' }, { status: 500 });
  }
}
