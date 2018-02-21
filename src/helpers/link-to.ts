import * as Handlebars from 'handlebars';
import * as url from 'url';

function isActive(currentUrl: string, linkUrl: string): boolean {
  let current = url.parse(currentUrl, true);
  let href = url.parse(linkUrl, true);
  if (current.pathname !== href.pathname) {
    return false;
  }
  for (let k in href.query) {
    if (href.query[k] === undefined || href.query[k] !== current.query[k]) {
      return false;
    }
  }
  return true;
}

export default function linkTo(this: any, opts?: Handlebars.HelperOptions) {
  if (!opts) {
    throw new Error('No options were passed to {{link-to}}');
  }
  let { hash } = opts;
  let { disabled, classNames, href } = hash;
  classNames = (classNames || '').split(' ');
  if (disabled) {
    classNames.push('disabled');
  }
  let active = isActive(opts.data.root.request.url, href);

  if (active) {
    classNames.push('active');
  }
  return new Handlebars.SafeString(
    `<a class='${classNames.join(' ')}' href='${href}'>${opts.fn(this)}</a>`
  );
}
