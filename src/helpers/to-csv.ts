export default function tocsv(arr: any[] = []) {
  if (!arr) {
    return '';
  }
  if (arr.length === 0) {
    return '';
  }
  return (arr || []).join(', ');
}
