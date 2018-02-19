import chalk from 'chalk';
import { highlight } from 'cli-highlight';
import { logger } from '../log';
import { Arr as JSONArray } from 'json-typescript';
import * as sqlFormatter from 'sql-formatter';

// tslint:disable:max-classes-per-file
export interface SQLStatement {
  get<T = any>(...params: any[]): Promise<T>;
  all<T = any>(...params: any[]): Promise<T[]>;
}

export abstract class SQLDatabase<S extends SQLStatement = any> {
  // tslint:disable-next-line:no-empty
  public static async setup(): Promise<SQLDatabase<any>> {
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
  public abstract getAllTableNames(): Promise<string[]>;
  public abstract getAllViews(): Promise<string[]>;

  protected colorizeQuery(query: string) {
    return highlight(sqlFormatter.format(query), {
      language: 'sql',
      ignoreIllegals: true
    });
  }

  protected logQuery(
    query: string,
    params: JSONArray,
    [begin, end]: [number, number]
  ) {
    let t = end - begin;
    let timestring =
      t < 1000000
        ? chalk.yellow(`${(t / 1000000).toPrecision(4)}ms`)
        : chalk.bgRed.white(`${(t / 1000000).toPrecision(4)}ms`);
    logger.info(
      [
        this.colorizeQuery(query) + ` (${timestring})`,
        `${chalk.grey('PARAMS:')} ${JSON.stringify(params)}`
      ].join('\n')
    );
  }
  protected async measure<T>(
    query: string,
    params: JSONArray,
    fn: () => Promise<T>
  ): Promise<T> {
    let [, begin] = process.hrtime();
    try {
      let result = await fn();
      if (process.env.NODE_ENV !== 'test') {
        let [, end] = process.hrtime();
        this.logQuery(query, params, [begin, end]);
      }
      return result;
    } catch (e) {
      logger.error(`Problem running query
${this.colorizeQuery(query)}
${chalk.yellow('PARAMS:')} ${JSON.stringify(params)}
${chalk.red('ERROR:')} ${e.toString()}`);
      throw e;
    }
  }
}
