import * as express from 'express';
import {
  getAllProducts,
  getDiscontinuedProducts,
  getProductsNeedingReorder
} from '../data/products';
import { logger } from '../log';

const router = express.Router();

router.get('/', async (req, res) => {
  let products = await getAllProducts();
  res.render('products', { products });
});

router.get('/discontinued', async (req, res) => {
  let products = await getDiscontinuedProducts();
  res.render('products', { products });
});

router.get('/needs-reorder', async (req, res) => {
  let products = await getProductsNeedingReorder();
  res.render('products', { products });
});

export default router;
