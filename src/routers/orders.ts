import * as express from 'express';
import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

import { getAllCustomers } from '../data/customers';
import { getAllEmployees } from '../data/employees';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderWithDetails,
  updateOrder
} from '../data/orders';
import { getAllProducts } from '../data/products';
import { getAllRegions } from '../data/regions';
import { getAllShippers } from '../data/shippers';

const router = express.Router();

/**
 * A set of validations to apply for the "create order" (POST /order) request.
 * These ensure that informative error messages are generated in the event that
 * any required properties are missing, they're of the wrong types, etc...
 */
const CREATE_ORDER_VALIDATIONS = [
  check('employeeid')
    .exists()
    .isNumeric()
    .toInt(),
  check('customerid')
    .exists()
    .isAlphanumeric()
    .trim(),
  check('shipcity')
    .exists()
    .trim(),
  check('shipaddress')
    .exists()
    .trim(),
  check('shipname')
    .exists()
    .trim(),
  check('shipvia')
    .exists()
    .isNumeric()
    .toInt(),
  check('shipregion')
    .exists()
    .isNumeric()
    .toInt(),
  check('shipcountry')
    .exists()
    .trim(),
  check('shippostalcode')
    .exists()
    .isAlphanumeric()
    .trim(),
  check('requireddate').exists(),
  check('freight')
    .exists()
    .isFloat()
    .toFloat(),
  check('details.id')
    .optional()
    .custom((value: any[]) => value instanceof Array),
  check('details.productid')
    .optional()
    .custom((value: any[]) => value instanceof Array),
  check('details.quantity')
    .optional()
    .custom((value: any[]) => value instanceof Array),
  check('details.discount')
    .optional()
    .custom((value: any[]) => value instanceof Array)
];

function normalizeOrderDetail(
  detail: { [K in keyof OrderDetail]: any }
): Pick<OrderDetail, 'id' | 'productid' | 'quantity' | 'unitprice' | 'discount'> {
  let [id, price] = detail.productid.split(';');
  let discount = parseFloat(detail.discount);
  return {
    id: detail.id,
    productid: parseInt(id, 10),
    unitprice: parseFloat(price) * (1 - discount),
    quantity: parseInt(detail.quantity, 10),
    discount
  };
}

function normalizeOrderDetails(raw: {
  [k: string]: any[];
}): Array<Pick<OrderDetail, 'id' | 'productid' | 'quantity' | 'unitprice' | 'discount'>> {
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
  return details.map(normalizeOrderDetail);
}

/**
 * Handle the HTTP request for a list of all CustomerOrder records
 */
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
    let orders = await getAllOrders(opts); // * get the data
    res.render('orders', { orders, page });
  } catch (e) {
    next(e);
  }
});

/**
 * Handle the HTTP request for rendering the "create new order" page
 */
router.get('/new', async (req, res, next) => {
  try {
    // Kick off all the async things ASAP and in parallel
    let cp = getAllCustomers(); // * get the data
    let ep = getAllEmployees();
    let rp = getAllRegions();
    let sp = getAllShippers();
    let pp = getAllProducts();
    // Wait for everything to finish
    let customers = await cp;
    let employees = await ep;
    let regions = await rp;
    let shippers = await sp;
    let products = await pp;

    res.render('orders/new', { customers, employees, regions, shippers, products });
  } catch (e) {
    next(e);
  }
});

/**
 * Handle the HTTP request for creation of a new CustomerOrder record
 * NOTE: This should render a JSON response
 */
router.post('/', CREATE_ORDER_VALIDATIONS, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  // matchedData returns only the subset of data validated by the middleware
  const orderData = matchedData(req) as any;
  let detailsObj = orderData.details || {};
  let details: Array<
    Pick<OrderDetail, 'productid' | 'quantity' | 'unitprice' | 'discount'>
  > = normalizeOrderDetails(detailsObj);
  try {
    let order = await createOrder(orderData, details); // * get the data
    res.redirect(`orders/${order.id}`);
  } catch (e) {
    res.status(500);
    res.send(e.toString());
  }
});

/**
 * Handle the HTTP request for updating an existing CustomerOrder record
 */
router.post('/:id', CREATE_ORDER_VALIDATIONS, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  // matchedData returns only the subset of data validated by the middleware
  const orderData = matchedData(req);
  let detailsObj = orderData.details || {};
  let details: Array<
    Pick<OrderDetail, 'id' | 'productid' | 'quantity' | 'unitprice' | 'discount'>
  > = normalizeOrderDetails(detailsObj);
  try {
    let order = await updateOrder(req.params.id, orderData as any, details); // * update the data
    res.redirect(`/orders/${order.id}`);
  } catch (e) {
    res.status(500);
    res.send(e.toString());
  }
});

/**
 * Handle the HTTP request for rendering an individual order page
 */
router.get('/:id', async (req, res) => {
  let [order, items] = await getOrderWithDetails(req.param('id')); // * update the data
  res.render('orders/show', { order, items });
});

/**
 * Handle the HTTP request for rendering the "edit order" page
 */
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

/**
 * Handle the HTTP request for deleting an order
 */
router.delete('/:id', async (req, res, next) => {
  try {
    await deleteOrder(req.param('id')); // * delete the order
    res.status(204);
    res.json({ status: 'ok' });
  } catch (e) {
    next(e);
  }
});

export default router;
