import * as express from 'express';
import { getSearchResults } from '../data/search';
import { logger } from '../log';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    let results = await getSearchResults(req.param('s').toLowerCase());
    res.render('search', { results });
  } catch (e) {
    next(e);
  }
});

export default router;
