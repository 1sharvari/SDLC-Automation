import { Router } from 'express';
import { cartController } from './cart.controller.js';

const router = Router();

router.get('/', (req, res, next) => cartController.getCart(req, res, next));
router.post('/items', (req, res, next) => cartController.addItem(req, res, next));
router.delete('/', (req, res, next) => cartController.clearCart(req, res, next));

export const cartRouter = router;
