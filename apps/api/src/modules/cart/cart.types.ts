import { Product } from '../products/products.types.js';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}
