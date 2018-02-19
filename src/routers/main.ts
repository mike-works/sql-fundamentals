import * as express from 'express';
import customerRouter from './customers';
import employeeRouter from './employees';
import orderRouter from './orders';
import supplierRouter from './suppliers';
import productRouter from './products';
import {
  getEmployeeSalesLeaderboard,
  getReorderList,
  getCustomerSalesLeaderboard,
  getProductSalesLeaderboard
} from '../data/dashboard';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    let pSalesLeader = getEmployeeSalesLeaderboard();
    let pCustomerLeader = getCustomerSalesLeaderboard();
    let pProductLeader = getProductSalesLeaderboard();
    let pReorderList = getReorderList();
    let reorderList = await pReorderList;
    let employeeLeaderboard = await pSalesLeader;
    let customerLeaderboard = await pCustomerLeader;
    let productLeaderboard = await pProductLeader;
    res.render('index', {
      employeeLeaderboard,
      customerLeaderboard,
      productLeaderboard,
      reorderList
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

export default router;
