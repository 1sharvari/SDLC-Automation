import { Router } from 'express';
import { productsController } from './products.controller.js';

const router = Router();

router.get('/', (req, res, next) => productsController.getProducts(req, res, next));
router.get('/categories', (req, res, next) => productsController.getCategories(req, res, next));
router.get('/:id', (req, res, next) => productsController.getProductById(req, res, next));

export const productsRouter = router;
