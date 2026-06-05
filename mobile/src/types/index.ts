/**
 * Global TypeScript Interfaces for Sylora Luxury E-commerce App
 */

export interface Product {
  id: string;
  title: string;
  price: number;
  brand: string;
  category: string;
  description: string;
  image: string; // Image path or URL
  sizes: string[];
  colors: string[];
  rating?: number;
  isExclusive?: boolean;
}

export interface CartItem {
  id: string; // Unique ID for this cart item entry (product.id + size + color)
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Returned' | 'Cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string; // ISO date string
  deliveryDate?: string; // ISO date string
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
}

export interface UserProfile {
  name: string;
  email: string;
  address: string;
  avatar?: string;
}
