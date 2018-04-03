import * as express from 'express';
import { check } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

type ProductFlavorName = 'sweet' | 'spicy' | 'sour' | 'salty' | 'bitter';

interface ProductFlavorFilter {
  flavorName: ProductFlavorName;
  level: 1 | 2 | 3 | 4 | 5;
  type: 'less-than' | 'greater-than';
}

/**
 *  Filtering options that may be used to customize the query for selecting a collection of Products
 */
interface ProductCollectionFilter {
  inventory: 'needs-reorder' | 'discontinued';
  requiredTags: string[];
  flavor: ProductFlavorFilter[];
}

import {
  getAllProducts,
  getProduct,
  getProductPricingHistory,
  updateProduct
} from '../data/products';

const router = express.Router();

const ALL_PRODUCTS_VALIDATORS = [
  check('flav'),
  check('inventory').isLowercase(),
  check('tags').isLowercase()
];

const UPDATE_PRODUCT_VALIDATORS = [
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
];

function buildFlavorFilters(flav: string): ProductFlavorFilter[] {
  let flavorFilter: ProductFlavorFilter[] = [];
  switch (flav) {
    case 'sweet-hot':
      flavorFilter.push({ flavorName: 'spicy', type: 'greater-than', level: 1 });
      flavorFilter.push({ flavorName: 'sweet', type: 'greater-than', level: 1 });
      break;
    case 'refreshing':
      flavorFilter.push({ flavorName: 'bitter', type: 'greater-than', level: 1 });
      flavorFilter.push({ flavorName: 'sour', type: 'greater-than', level: 1 });
      break;
    case 'sweet-sour':
      flavorFilter.push({ flavorName: 'sour', type: 'greater-than', level: 1 });
      flavorFilter.push({ flavorName: 'sweet', type: 'greater-than', level: 1 });
      break;
  }
  return flavorFilter;
}

/**
 * Handle the HTTP request for rendering the list of all Products
 */
router.get('/', ALL_PRODUCTS_VALIDATORS, async (req: express.Request, res: express.Response) => {
  const orderData = matchedData(req);
  orderData.tags = (orderData.tags || '')
    .trim()
    .split(/\s*\,\s*/g)
    .filter((x: string) => x);

  let products = await getAllProducts({
    filter: {
      requiredTags: orderData.tags,
      inventory: orderData.inventory,
      flavor: buildFlavorFilters(orderData.flav)
    }
  });
  res.render('products', { products });
});

/**
 * Handle the HTTP request for rendering an individual Product's details
 */
router.get('/:id', async (req: express.Request, res: express.Response) => {
  let prProduct = getProduct(req.params.id);
  let prPricing = getProductPricingHistory(req.params.id);
  let product = await prProduct;
  let pricingHistory = await prPricing;
  res.render('products/show', { product, pricingHistory });
});

/**
 * Handle the HTTP request for updating an individual Product
 */
router.put(
  '/:id',
  UPDATE_PRODUCT_VALIDATORS,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
