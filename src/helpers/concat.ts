export default function concat(...parts: string[]) {
  return parts.slice(0, parts.length - 1).join('');
}
