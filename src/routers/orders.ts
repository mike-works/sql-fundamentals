import * as express from 'express';
import { getAllOrders, getOrder } from '../data/orders';
import { logger } from '../log';

const router = express.Router();

router.get('/', async (req, res) => {
  let orders = await getAllOrders();
  res.render('orders', { orders });
});

router.get('/:id', async (req, res) => {
  let order = await getOrder(req.param('id'));
  res.render('orders/show', { order });
});

export default router;
