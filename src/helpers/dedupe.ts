import { uniq } from 'lodash';

export default function dedupe([, parts]: any[]) {
  return uniq(parts);
}
