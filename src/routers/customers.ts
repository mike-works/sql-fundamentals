import * as express from 'express';

import { check } from 'express-validator/check';
import { getAllCustomers, getCustomer } from '../data/customers';
import { getCustomerOrders } from '../data/orders';

const router = express.Router();

/**
 * Handle the HTTP request for a list of all Customers
 */
router.get('/', async (req, res, next) => {
  try {
    let { filter = '' } = req.query || {};
    let customers = await getAllCustomers({ filter }); // * get the data
    res.render('customers', { customers, filter });
  } catch (e) {
    next(e);
  }
});

/**
 * Handle the HTTP request an individual Customer
 */
router.get(
  '/:id',
  [check('id')],
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let { page = 1, perPage = 30, sort, order } = req.query;
      let id = req.params.id;
      let customer = await getCustomer(id); // * get the data
      let orders = await getCustomerOrders(id, { page, perPage, sort, order }); // * get the data
      res.render('customers/show', { customer, orders, page });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
