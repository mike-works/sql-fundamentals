import * as express from 'express';
import { getAllCustomers, getCustomer } from '../data/customers';
import { logger } from '../log';

const router = express.Router();

router.get('/', async (req, res) => {
  let customers = await getAllCustomers();
  res.render('customers', { customers });
});

router.get('/:id', async (req, res) => {
  let customer = await getCustomer(req.param('id'));
  res.render('customers/show', { customer });
});

export default router;
