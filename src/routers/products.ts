import * as express from 'express';
import { check } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

import {
  getAllProducts,
  updateProduct,
  ProductFlavorFilter
} from '../data/products';

const router = express.Router();

router.get(
  '/',
  [
    check('flav').isLowercase(),
    check('inventory').isLowercase(),
    check('tags').isLowercase()
  ],
  async (req: express.Request, res: express.Response) => {
    const orderData = matchedData(req);
    orderData.tags = (orderData.tags || '')
      .trim()
      .split(/\s*\,\s*/g)
      .filter((x: string) => x);

    console.log(JSON.stringify(orderData));
    let flavorFilter: ProductFlavorFilter[] = [];
    switch (orderData.flav) {
      case 'sweet-hot':
        flavorFilter.push({
          flavorName: 'spicy',
          type: 'greater-than',
          level: 1
        });
        flavorFilter.push({
          flavorName: 'sweet',
          type: 'greater-than',
          level: 1
        });
        break;
      case 'refreshing':
        flavorFilter.push({
          flavorName: 'bitter',
          type: 'greater-than',
          level: 1
        });
        flavorFilter.push({
          flavorName: 'sour',
          type: 'greater-than',
          level: 1
        });
        break;
      case 'sweet-sour':
        flavorFilter.push({
          flavorName: 'sour',
          type: 'greater-than',
          level: 1
        });
        flavorFilter.push({
          flavorName: 'sweet',
          type: 'greater-than',
          level: 1
        });
        break;
    }
    let products = await getAllProducts({
      filter: {
        requiredTags: orderData.tags,
        inventory: orderData.inventory,
        flavor: flavorFilter
      }
    });
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
