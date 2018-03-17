import * as express from 'express';

import { getAllSuppliers, getSupplier } from '../data/suppliers';

const router = express.Router();

/**
 * Handle the HTTP request for the list of all Suppliers
 */
router.get('/', async (req, res, next) => {
  try {
    let suppliers = await getAllSuppliers();
    res.render('suppliers', { suppliers });
  } catch (e) {
    next(e);
  }
});

/**
 * Handle the HTTP request for an individual Supplier
 */
router.get('/:id', async (req, res, next) => {
  try {
    let supplier = await getSupplier(req.param('id'));
    res.render('suppliers/show', { supplier });
  } catch (e) {
    next(e);
  }
});

export default router;
