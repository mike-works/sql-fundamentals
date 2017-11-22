import * as express from 'express';
import { getAllEmployees, getEmployee } from '../data/employees';
import { logger } from '../log';

const router = express.Router();

router.get('/', async (req, res) => {
  let employees = await getAllEmployees();
  res.render('customers', { employees });
});

router.get('/:id', async (req, res) => {
  let employee = await getEmployee(req.param('id'));
  res.render('employees/show', { employee });
});

export default router;
