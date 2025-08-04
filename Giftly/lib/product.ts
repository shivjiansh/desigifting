import { connectDB } from './db';
import { Product } from './types';

export async function getProducts(filters?: {
  category?: string;
  sellerId?: string;
  search?: string;
  limit?: number;
  page?: number;
}): Promise<Product[]> {
  const db = await connectDB();
  const collection = db.collection('products');

  let query: any = {};

  if (filters?.category) {
    query.category = filters.category;
  }

  if (filters?.sellerId) {
    query.sellerId = filters.sellerId;
  }

  if (filters?.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } }
    ];
  }

  const limit = filters?.limit || 20;
  const skip = ((filters?.page || 1) - 1) * limit;

  const products = await collection
    .find(query)
    .skip(skip)
    .limit(limit)
    .toArray();

  return products.map(product => ({
    ...product,
    id: product._id.toString(),
    _id: product._id.toString()
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await connectDB();
  const collection = db.collection('products');

  const product = await collection.findOne({ _id: id });

  if (!product) return null;

  return {
    ...product,
    id: product._id.toString(),
    _id: product._id.toString()
  };
}

export async function createProduct(productData: Omit<Product, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const db = await connectDB();
  const collection = db.collection('products');

  const now = new Date();
  const product = {
    ...productData,
    createdAt: now,
    updatedAt: now
  };

  const result = await collection.insertOne(product);

  return {
    ...product,
    id: result.insertedId.toString(),
    _id: result.insertedId.toString()
  };
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = await connectDB();
  const collection = db.collection('products');

  const updateData = {
    ...updates,
    updatedAt: new Date()
  };

  const result = await collection.findOneAndUpdate(
    { _id: id },
    { $set: updateData },
    { returnDocument: 'after' }
  );

  if (!result.value) return null;

  return {
    ...result.value,
    id: result.value._id.toString(),
    _id: result.value._id.toString()
  };
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await connectDB();
  const collection = db.collection('products');

  const result = await collection.deleteOne({ _id: id });
  return result.deletedCount > 0;
}