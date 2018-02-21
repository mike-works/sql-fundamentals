import * as express from 'express';

import { getAllEmployees, getEmployee } from '../data/employees';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    let employees = await getAllEmployees();
    res.render('employees/index', { employees });
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    let employee = await getEmployee(req.param('id'));
    res.render('employees/show', { employee });
  } catch (e) {
    next(e);
  }
});

export default router;
