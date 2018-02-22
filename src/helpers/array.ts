export default function array(...parts: any[]) {
  const contents = parts.slice(0, parts.length - 1);
  return contents;
}
