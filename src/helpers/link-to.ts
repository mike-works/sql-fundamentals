import * as Handlebars from 'handlebars';

export default function linkTo(this: any, opts?: Handlebars.HelperOptions) {
  if (!opts) {
    throw new Error('No options were passed to {{link-to}}');
  }
  let { hash } = opts;
  let { disabled, classNames, href } = hash;
  classNames = classNames.split(' ');
  if (disabled) {
    classNames.push('disabled');
  }
  return new Handlebars.SafeString(`<a class='${classNames.join(' ')}' href='${href}'>${opts.fn(this)}</a>`);
}
