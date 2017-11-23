import * as express from 'express';
import { getAllProducts } from '../data/products';
import { logger } from '../log';

const router = express.Router();

router.get('/', async (req, res) => {
  let products = await getAllProducts();
  res.render('products', { products });
});

export default router;
