import { numberize } from '../utils';

export default function add(a: string | number, b: string | number) {
  return numberize(a) + numberize(b);
}
