import * as moment from 'moment';

const DEFAULT_PATTERN = 'll';

export default function formatDate(
  dateString: string,
  opts: Handlebars.HelperOptions
) {
  let pattern = opts.hash.pattern || DEFAULT_PATTERN;
  return moment(dateString).format(pattern);
}
