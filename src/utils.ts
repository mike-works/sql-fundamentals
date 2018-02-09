export function numberize(n: any): number {
  return n === 'number' ? n : parseFloat(n);
}

export function jsonize(n: any): any {
  return JSON.stringify(n);
}

export function sqlFormat(v: any) {
  if (typeof v === 'string') {
    return `'${v}'`;
  } else {
    return v;
  }
}
