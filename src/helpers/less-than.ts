import { numberize } from '../utils';

export default function lessThan(a: string, b: string) {
  return numberize(a) < numberize(b);
}
