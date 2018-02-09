import { jsonize } from '../utils';

export default function or(a: string, b: string) {
  return typeof a !== 'undefined' ? a : b;
}
