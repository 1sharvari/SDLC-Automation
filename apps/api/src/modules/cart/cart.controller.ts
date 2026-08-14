import { Request, Response, NextFunction } from 'express';
import { cartService } from './cart.service.js';
import { z } from 'zod';

const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().optional().default(1)
});

export class CartController {
  public getCart(_req: Request, res: Response, next: NextFunction): void {
    try {
      const cart = cartService.getCart();
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  public addItem(req: Request, res: Response, next: NextFunction): void {
    try {
      const { productId, quantity } = addToCartSchema.parse(req.body);
      const cart = cartService.addItem(productId, quantity);
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  public clearCart(_req: Request, res: Response, next: NextFunction): void {
    try {
      const cart = cartService.clearCart();
      res.status(200).json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
