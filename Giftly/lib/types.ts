export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'buyer' | 'seller';
  createdAt?: Date;
  updatedAt?: Date;
  // Seller specific fields
  storeName?: string;
  storeDescription?: string;
  storeLogo?: string;
  storeBanner?: string;
  // Buyer specific fields
  addresses?: Address[];
}

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sellerId: string;
  sellerName?: string;
  stock: number;
  sku?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  _id?: string;
  id?: string;
  orderNumber: string;
  buyerId: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress: Address;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  productId: string;
  sellerId: string;
  quantity: number;
  price: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
}

export interface Address {
  _id?: string;
  id?: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Review {
  _id?: string;
  id?: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}