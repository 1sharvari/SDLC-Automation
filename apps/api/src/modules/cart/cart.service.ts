import { Cart, CartItem } from './cart.types.js';
import { productsService } from '../products/products.service.js';

export class CartService {
  private items: Map<string, number> = new Map();

  public getCart(): Cart {
    const cartItems: CartItem[] = [];
    let totalQuantity = 0;
    let totalPrice = 0;

    for (const [productId, quantity] of this.items.entries()) {
      const product = productsService.getProductById(productId);
      if (product) {
        cartItems.push({ product, quantity });
        totalQuantity += quantity;
        totalPrice += product.price * quantity;
      }
    }

    return {
      items: cartItems,
      totalQuantity,
      totalPrice: Number(totalPrice.toFixed(2))
    };
  }

  public addItem(productId: string, quantity = 1): Cart {
    const current = this.items.get(productId) || 0;
    this.items.set(productId, current + quantity);
    return this.getCart();
  }

  public clearCart(): Cart {
    this.items.clear();
    return this.getCart();
  }
}

export const cartService = new CartService();
