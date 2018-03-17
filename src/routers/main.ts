import * as express from 'express';

import {
  getCustomerSalesLeaderboard,
  getEmployeeSalesLeaderboard,
  getProductSalesLeaderboard,
  getRecentOrders,
  getReorderList
} from '../data/dashboard';

import customerRouter from './customers';
import employeeRouter from './employees';
import orderRouter from './orders';
import productRouter from './products';
import searchRouter from './search';
import supplierRouter from './suppliers';

const router = express.Router();

/**
 * Handle the HTTP request for the dashboard page
 */
router.get('/', async (req, res, next) => {
  try {
    // Make sure we kick off all our async things ASAP and in parallel
    let pSalesLeader = getEmployeeSalesLeaderboard();
    let pCustomerLeader = getCustomerSalesLeaderboard();
    let pProductLeader = getProductSalesLeaderboard();
    let pReorderList = getReorderList();
    let pRecentOrders = getRecentOrders();
    // Wait for them all to resolve
    let reorderList = await pReorderList;
    let employeeLeaderboard = await pSalesLeader;
    let customerLeaderboard = await pCustomerLeader;
    let productLeaderboard = await pProductLeader;
    let recentOrders = await pRecentOrders;
    res.render('index', {
      employeeLeaderboard,
      customerLeaderboard,
      productLeaderboard,
      reorderList,
      recentOrders
    });
  } catch (e) {
    throw e;
  }
});

router.use('/employees', employeeRouter);
router.use('/customers', customerRouter);
router.use('/suppliers', supplierRouter);
router.use('/orders', orderRouter);
router.use('/products', productRouter);
router.use('/search', searchRouter);

export default router;
