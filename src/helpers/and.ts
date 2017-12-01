import { jsonize } from '../utils';

export default function and(a: string, b: string) {
  return jsonize(a) && jsonize(b);
}
