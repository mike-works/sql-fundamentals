declare module 'debounce' {
  namespace debounce {

  }
  function debounce<A extends Function>(
    f: A,
    interval?: number,
    immediate?: boolean
  ): A & { clear(): void };
  export = debounce;
}
