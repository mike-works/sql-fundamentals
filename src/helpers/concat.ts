import { concat, isArray } from 'lodash';

function concatString(...contents: string[]): string {
  return contents.join('');
}

function concatArray(arr: any[], ...toAdd: any[]): any[] {
  return concat(arr, toAdd);
}

export default function concatHelper(...parts: any[]): string | any[] {
  const contents = parts.slice(0, parts.length - 1);
  if (contents.length === 1) {
    return contents[0];
  }
  if (typeof contents[0] === 'string') {
    return concatString(...contents);
  }
  if (isArray(contents[0])) {
    return concatArray(contents[0] as any[], contents.slice(1));
  }

  throw new Error(
    `Unknown type of first value ${contents[0]} (${typeof contents[0]})`
  );
}
