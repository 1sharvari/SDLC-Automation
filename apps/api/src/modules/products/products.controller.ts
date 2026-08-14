import { Request, Response, NextFunction } from 'express';
import { productsService } from './products.service.js';
import { getProductsQuerySchema } from './products.schema.js';

export class ProductsController {
  public getProducts(req: Request, res: Response, next: NextFunction): void {
    try {
      const validatedQuery = getProductsQuerySchema.parse(req.query);
      const products = productsService.getProducts(validatedQuery);
      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  public getCategories(_req: Request, res: Response, next: NextFunction): void {
    try {
      const categories = productsService.getCategories();
      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  }

  public getProductById(req: Request, res: Response, next: NextFunction): void {
    try {
      const { id } = req.params;
      const product = productsService.getProductById(id);
      if (!product) {
        res.status(404).json({
          success: false,
          message: `Product with id ${id} not found`
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productsController = new ProductsController();
