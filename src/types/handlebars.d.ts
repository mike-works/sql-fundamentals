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
    hash: { [key: string]: any };
    fn: (ctxt: any) => {};
    data: {
      exphbs: ExpHbsState;
      root: {
        settings: any;
        request: Request;
      };
    };
  }

  interface HelperSet {
    [key: string]: () => any;
  }
}
