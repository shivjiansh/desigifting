import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const productsCol = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCol);

    // Extract categories from products
    const categorySet = new Set<string>();
    productsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.category && typeof data.category === 'string') {
        categorySet.add(data.category);
      }
    });

    // Convert set to array and sort alphabetically
    const categories = Array.from(categorySet).sort().map(cat => ({ value: cat, label: cat }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Failed to fetch categories from products', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
