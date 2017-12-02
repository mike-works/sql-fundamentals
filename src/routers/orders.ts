import * as express from 'express';
import { getAllOrders, getOrder, getOrderWithDetails } from '../data/orders';
import { logger } from '../log';

const router = express.Router();

router.get('/', async (req, res) => {
  let { page = 1, perPage, sort, order } = req.query;
  let orders = await getAllOrders({ page, perPage, sort, order });
  res.render('orders', { orders, page });
});

router.get('/:id', async (req, res) => {
  let [order, items] = await getOrderWithDetails(req.param('id'));
  res.render('orders/show', { order, items });
});

export default router;
