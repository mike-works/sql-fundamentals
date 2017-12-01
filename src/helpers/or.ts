import { jsonize } from '../utils';

export default function or(a: string, b: string) {
  return jsonize(a) || jsonize(b);
}
