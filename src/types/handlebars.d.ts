// tslint:disable-next-line:no-namespace
declare namespace Handlebars {
  interface ExpHbsState {
    cache: boolean;
    view: string;
    layout: string;
    helpers: HelperSet;
    partials: any;
    filePath: string;
  }

  interface HelperOptions {
    name: string;
  }

  interface HelperSet {
    [key: string]: () => any;
  }
}
