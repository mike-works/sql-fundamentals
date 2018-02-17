import * as express from 'express';
import { getAllCustomers, getCustomer } from '../data/customers';
import { getCustomerOrders } from '../data/orders';
import { logger } from '../log';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    let { filter = '' } = req.query || {};
    let customers = await getAllCustomers({ filter });
    res.render('customers', { customers, filter });
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    let { page = 1, perPage = 30, sort, order } = req.query;
    let id = req.params.id;
    let customer = await getCustomer(id);
    let orders = await getCustomerOrders(id, { page, perPage, sort, order });
    res.render('customers/show', { customer, orders, page });
  } catch (e) {
    next(e);
  }
});

export default router;
