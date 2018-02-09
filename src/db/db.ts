// tslint:disable:max-classes-per-file
export interface SQLStatement {
  get<T = any>(...params: any[]): Promise<T>;
  all<T = any>(...params: any[]): Promise<T[]>;
}
export abstract class SQLDatabase<S extends SQLStatement> {
  // tslint:disable-next-line:no-empty
  public static async setup(opts: any): Promise<SQLDatabase<any>> {
    return Promise.reject('Not yet implemented');
  }
  public statements: {
    [key: string]: S;
  };
  protected constructor() {
    this.statements = {};
  }
  public abstract run(
    sql: string,
    ...params: any[]
  ): Promise<{ lastID: number | string }>;
  public abstract get<T = any>(sql: string, ...params: any[]): Promise<T>;
  public abstract all<T = any>(sql: string, ...params: any[]): Promise<T[]>;
  public abstract prepare(
    name: string,
    sql: string,
    ...params: any[]
  ): Promise<S>;

  public abstract getIndicesForTable(tableName: string): Promise<string[]>;
  public abstract getAllTriggers(): Promise<string[]>;
  public abstract getAllViews(): Promise<string[]>;
}
