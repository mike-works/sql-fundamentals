import chalk from 'chalk';
import { highlight } from 'cli-highlight';
import { Arr as JSONArray } from 'json-typescript';
import * as sqlFormatter from 'sql-formatter';

import { logger } from '../log';
import TimingManager from '../timing';

// tslint:disable:max-classes-per-file
export interface SQLStatement {
  get<T = any>(...params: any[]): Promise<T>;
  all<T = any>(...params: any[]): Promise<T[]>;
}

function timeVal(ms: number) {
  if (ms < 1) {
    return `${(ms * 1000).toPrecision(4)}μs`;
  } else if (ms < 1000) {
    return `${ms.toPrecision(4)}ms`;
  } else {
    return `${(ms / 1000).toPrecision(4)}s`;
  }
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
  // tslint:disable-next-line:no-empty
  public async shutdown(): Promise<void> {}
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
  public abstract getAllFunctions(): Promise<string[]>;
  public abstract getAllTableNames(): Promise<string[]>;
  public abstract getAllViews(): Promise<string[]>;
  public abstract getAllMaterializedViews(): Promise<string[]>;

  protected colorizeQuery(query: string) {
    return highlight(sqlFormatter.format(query), {
      language: 'sql',
      ignoreIllegals: true
    });
  }

  protected logQuery(query: string, params: JSONArray, t: number) {
    let timestring =
      t < 5
        ? chalk.bgGreenBright.black(timeVal(t))
        : t < 100
          ? chalk.bgYellowBright.black(timeVal(t))
          : chalk.bgRedBright.white(timeVal(t));
    logger.info(
      [
        this.colorizeQuery(query) + ` (${timestring})`,
        `${chalk.grey('PARAMS:')} ${JSON.stringify(params)}`
      ].join('\n')
    );
    return t;
  }
  protected async measure<T>(
    query: string,
    params: JSONArray,
    fn: () => Promise<T>
  ): Promise<T> {
    let begin = process.hrtime();
    try {
      let result = await fn();
      let t = -1;
      let end = process.hrtime();
      let diff = [end[0] - begin[0], end[1] - begin[1]];
      t = diff[0] * 1000 + diff[1] / 1000000;
      if (process.env.NODE_ENV !== 'test') {
        this.logQuery(query, params, t);
      }
      if (TimingManager.current) {
        TimingManager.current.addTime(
          'db',
          t,
          query.trim().replace(/[\(\)\n\;]+/g, '')
        );
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
