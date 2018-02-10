import * as express from 'express';
import {
  getAllProducts,
  updateProduct,
  getDiscontinuedProducts,
  getProductsNeedingReorder
} from '../data/products';
import { matchedData } from 'express-validator/filter';
import { check } from 'express-validator/check';
import { logger } from '../log';

const router = express.Router();

router.get('/', async (req, res) => {
  let products = await getAllProducts();
  res.render('products', { products });
});

router.put(
  '/:id',
  [
    check('sweet')
      .exists()
      .isNumeric()
      .toInt(),
    check('salty')
      .exists()
      .isNumeric()
      .toInt(),
    check('spicy')
      .exists()
      .isNumeric()
      .toInt(),
    check('sour')
      .exists()
      .isNumeric()
      .toInt(),
    check('bitter')
      .exists()
      .isNumeric()
      .toInt()
  ],
  async (req: express.Request, res: express.Response) => {
    const orderData = matchedData(req);
    await updateProduct(req.param('id'), orderData);
    res.json({ ok: 'ok' });
  }
);

router.get('/discontinued', async (req, res) => {
  let products = await getDiscontinuedProducts();
  res.render('products', { products });
});

router.get('/needs-reorder', async (req, res) => {
  let products = await getProductsNeedingReorder();
  res.render('products', { products });
});

export default router;
