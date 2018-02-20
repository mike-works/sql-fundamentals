import * as express from 'express';
import * as moment from 'moment';
import { check, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

import { Request, Response } from 'express';
import { getAllCustomers } from '../data/customers';
import { getAllEmployees } from '../data/employees';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  getOrderWithDetails
} from '../data/orders';
import { getAllRegions } from '../data/regions';
import { getAllShippers } from '../data/shippers';
import { logger } from '../log';
import { getAllProducts } from '../data/products';
import { mapValues } from 'lodash';

const ORDER_VALIDATIONS = [
  check('EmployeeId')
    .exists()
    .isNumeric()
    .toInt(),
  check('CustomerId')
    .exists()
    .isAlphanumeric()
    .trim(),
  check('ShipCity')
    .exists()
    .trim(),
  check('ShipAddress')
    .exists()
    .trim(),
  check('ShipName')
    .exists()
    .trim(),
  check('ShipVia')
    .exists()
    .isNumeric()
    .toInt(),
  check('ShipRegion')
    .exists()
    .isNumeric()
    .toInt(),
  check('ShipCountry')
    .exists()
    .isAlphanumeric()
    .trim(),
  check('ShipPostalCode')
    .exists()
    .isAlphanumeric()
    .trim(),
  check('RequiredDate').exists(),
  check('Freight')
    .exists()
    .isFloat()
    .toFloat(),
  check('details.Id')
    .optional()
    .custom((value: any[]) => value instanceof Array),
  check('details.ProductId')
    .optional()
    .custom((value: any[]) => value instanceof Array),
  check('details.Quantity')
    .optional()
    .custom((value: any[]) => value instanceof Array),
  check('details.Discount')
    .optional()
    .custom((value: any[]) => value instanceof Array)
];

const router = express.Router();

function normalizeOrderDetails(raw: {
  [k: string]: any[];
}): Array<Partial<OrderDetail>> {
  let keys = Object.keys(raw);
  let n = keys.reduce((ct, val) => Math.max(ct, raw[val].length), 0);
  let details: Array<{ [K in keyof OrderDetail]: any }> = [];
  for (let i = 0; i < n; i++) {
    let o: { [k: string]: any } = {};
    for (let k in keys) {
      if (raw.hasOwnProperty(keys[k])) {
        o[keys[k]] = raw[keys[k]][i];
      }
    }
    details.push(o as any);
  }
  return details.map(d => {
    let [id, price] = d.productid.split(';');
    let discount = parseFloat(d.discount as string);
    return {
      id: d.id,
      productid: parseInt(id, 10),
      unitprice: parseFloat(price) * (1 - discount),
      quantity: parseInt(d.quantity as string, 10),
      discount
    };
  });
}

router.get('/', async (req, res, next) => {
  try {
    let { page = 1, perPage = 20 } = req.query;
    let opts: { [k: string]: number | string } = {
      page: req.query.page || 1,
      perPage: req.query.perPage || 20
    };
    if (typeof req.query.sort === 'string' && req.query.sort !== '') {
      opts.sort = req.query.sort;
    }
    if (typeof req.query.order === 'string' && req.query.order !== '') {
      opts.order = req.query.order;
    }
    let orders = await getAllOrders(opts);
    res.render('orders', { orders, page });
  } catch (e) {
    next(e);
  }
});

router.get('/new', async (req, res, next) => {
  try {
    let cp = getAllCustomers();
    let ep = getAllEmployees();
    let rp = getAllRegions();
    let sp = getAllShippers();
    let pp = getAllProducts();
    let customers = await cp;
    let employees = await ep;
    let regions = await rp;
    let shippers = await sp;
    let products = await pp;

    res.render('orders/new', {
      customers,
      employees,
      regions,
      shippers,
      products
    });
  } catch (e) {
    next(e);
  }
});

router.post('/', ORDER_VALIDATIONS, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  // matchedData returns only the subset of data validated by the middleware
  const orderData = matchedData(req);
  let detailsObj = orderData.details || {};
  let details: Array<Partial<OrderDetail>> = normalizeOrderDetails(detailsObj);
  try {
    let order = await createOrder(orderData, details);
    res.redirect(`orders/${order.id}`);
  } catch (e) {
    res.status(500);
    res.send(e.toString());
  }
});

router.post('/:id', ORDER_VALIDATIONS, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  // matchedData returns only the subset of data validated by the middleware
  const orderData = matchedData(req);
  let detailsObj = orderData.details || {};
  let details: Array<Partial<OrderDetail>> = normalizeOrderDetails(detailsObj);
  try {
    let order = await updateOrder(req.params.id, orderData as any, details);
    res.redirect(`/orders/${order.id}`);
  } catch (e) {
    res.status(500);
    res.send(e.toString());
  }
});

router.get('/:id', async (req, res) => {
  let [order, items] = await getOrderWithDetails(req.param('id'));
  res.render('orders/show', { order, items });
});

router.get('/:id/edit', async (req, res, next) => {
  try {
    let cp = getAllCustomers();
    let ep = getAllEmployees();
    let rp = getAllRegions();
    let sp = getAllShippers();
    let pp = getAllProducts();
    let [order, details] = await getOrderWithDetails(req.param('id'));
    let customers = await cp;
    let employees = await ep;
    let regions = await rp;
    let shippers = await sp;
    let products = await pp;
    res.render('orders/edit', {
      order,
      details,
      customers,
      employees,
      regions,
      shippers,
      products
    });
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteOrder(req.param('id'));
    res.status(204);
    res.json({ status: 'ok' });
  } catch (e) {
    next(e);
  }
});

export default router;
