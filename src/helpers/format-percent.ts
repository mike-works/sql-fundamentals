import * as accounting from 'accounting';

export default function formatPercent(
  pctValue: string,
  opts: Handlebars.HelperOptions
) {
  let x = parseFloat(pctValue) * 100;
  return `${accounting.formatNumber(x, 0)}%`;
}
