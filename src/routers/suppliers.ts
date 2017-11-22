import * as express from 'express';
import { getAllSuppliers, getSupplier } from '../data/suppliers';
import { logger } from '../log';

const router = express.Router();

router.get('/', async (req, res) => {
  let suppliers = await getAllSuppliers();
  res.render('suppliers', { suppliers });
});

router.get('/:id', async (req, res) => {
  let supplier = await getSupplier(req.param('id'));
  res.render('suppliers/show', { supplier });
});

export default router;
