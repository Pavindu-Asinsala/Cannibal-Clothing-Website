export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  name: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}