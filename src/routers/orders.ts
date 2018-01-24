import * as express from 'express';

import { check, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

import { Request, Response } from 'express';
import { getAllCustomers } from '../data/customers';
import { getAllEmployees } from '../data/employees';
import { createOrder, deleteOrder, getAllOrders, getOrder, getOrderWithDetails } from '../data/orders';
import { getAllRegions } from '../data/regions';
import { getAllShippers } from '../data/shippers';
import { logger } from '../log';

const router = express.Router();

router.get('/', async (req, res) => {
  let { page = 1, perPage, sort, order } = req.query;
  let orders = await getAllOrders({ page, perPage, sort, order });
  res.render('orders', { orders, page });
});

router.get('/new', async (req, res) => {
  let cp = getAllCustomers();
  let ep = getAllEmployees();
  let rp = getAllRegions();
  let sp = getAllShippers();
  let customers = await cp;
  let employees = await ep;
  let regions = await rp;
  let shippers = await sp;

  res.render('orders/new', { customers, employees, regions, shippers });
});

router.post('/', [
  check('EmployeeId').exists().isNumeric().toInt(),
  check('CustomerId').exists().isAlphanumeric().trim(),
  check('ShipCity').exists().trim(),
  check('ShipAddress').exists().trim(),
  check('ShipName').exists().trim(),
  check('ShipVia').exists().isNumeric().toInt(),
  check('ShipRegion').exists().isNumeric().toInt(),
  check('ShipCountry').exists().isAlphanumeric().trim(),
  check('ShipPostalCode').exists().isAlphanumeric().trim(),
  check('RequiredDate').exists().toDate().isAfter(),
  check('Freight').exists().isFloat().toFloat()
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  // matchedData returns only the subset of data validated by the middleware
  const orderData = matchedData(req);
  let order = await createOrder(orderData);

  res.redirect(`orders/${order.Id}`);
});

router.get('/:id', async (req, res) => {
  let [order, items] = await getOrderWithDetails(req.param('id'));
  res.render('orders/show', { order, items });
});

router.delete('/:id', async (req, res) => {
  await deleteOrder(req.param('id'));
  res.status(204);
  res.json({ status: 'ok' });
});

export default router;
