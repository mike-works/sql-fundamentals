import * as accounting from 'accounting';

const DEFAULT_PATTERN = 'll';

export default function formatMoney(
  moneyValue: string,
  opts: Handlebars.HelperOptions
) {
  let pattern = opts.hash.pattern || DEFAULT_PATTERN;
  return accounting.formatMoney(moneyValue);
}
