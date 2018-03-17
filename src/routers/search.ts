import * as express from 'express';

import { getSearchResults } from '../data/search';

const router = express.Router();

/**
 * Handle the HTTP request for a list of search results
 */
router.get('/', async (req, res, next) => {
  try {
    let term = req.param('s').toLowerCase();
    let results = await getSearchResults(term); // * get the data
    res.render('search', { results });
  } catch (e) {
    next(e);
  }
});

export default router;
