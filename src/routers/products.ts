import * as express from 'express';
import { getAllProducts, updateProduct } from '../data/products';
import { matchedData } from 'express-validator/filter';
import { check } from 'express-validator/check';
import { logger } from '../log';

const router = express.Router();

router.get(
  '/',
  [
    check('flav')
      .isLowercase()
      .isWhitelisted(['sweet-hot', 'sweet-sour', 'refreshing']),
    check('tags').isLowercase()
  ],
  async (req: express.Request, res: express.Response) => {
    const orderData = matchedData(req);
    orderData.tags = (orderData.tags || '')
      .trim()
      .split(/\s*\,\s*/g)
      .filter((x: string) => x);

    console.log(JSON.stringify(orderData));

    let products = await getAllProducts(orderData.tags);
    res.render('products', { products });
  }
);

router.put(
  '/:id',
  [
    check('metadata.flavor.sweet')
      .exists()
      .isNumeric()
      .toInt(),
    check('metadata.flavor.salty')
      .exists()
      .isNumeric()
      .toInt(),
    check('metadata.flavor.spicy')
      .exists()
      .isNumeric()
      .toInt(),
    check('metadata.flavor.sour')
      .exists()
      .isNumeric()
      .toInt(),
    check('metadata.flavor.bitter')
      .exists()
      .isNumeric()
      .toInt(),
    check('tags').exists()
  ],
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const orderData = matchedData(req);
    try {
      await updateProduct(req.params.id, orderData);
      res.json({ ok: 'ok' });
    } catch (e) {
      res.status(500);
      res.send(e.toString());
    }
  }
);

export default router;
