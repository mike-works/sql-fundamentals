import { assign } from 'lodash';
import * as url from 'url';

const mergeQps = (originalUrl: string, opts?: Handlebars.HelperOptions) => {
  let u = url.parse(originalUrl, true);
  if (opts) {
    assign(u.query, opts.hash || {});
  }
  delete u.search;
  return url.format(u);
};

export default mergeQps;
