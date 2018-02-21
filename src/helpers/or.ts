export default function or(a: string, b: string) {
  let result = typeof a !== 'undefined' ? a : b;
  return result;
}
