import * as express from 'express';

import { getAllEmployees, getEmployee } from '../data/employees';

const router = express.Router();

/**
 * Handle the HTTP request for a list of all Employees
 */
router.get('/', async (req, res, next) => {
  try {
    let employees = await getAllEmployees(); // * get the data
    res.render('employees/index', { employees });
  } catch (e) {
    next(e);
  }
});

/**
 * Handle the HTTP request for an individual Employee
 */
router.get('/:id', async (req, res, next) => {
  try {
    let employee = await getEmployee(req.param('id')); // * get the data
    res.render('employees/show', { employee });
  } catch (e) {
    next(e);
  }
});

export default router;
