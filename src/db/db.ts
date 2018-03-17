import chalk from 'chalk';
import { highlight } from 'cli-highlight';
import { Arr as JSONArray } from 'json-typescript';
import * as sqlFormatter from 'sql-formatter';

import { logger } from '../log';
import TimingManager from '../timing';

export interface SQLPreparedStatement {
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

/**
 * Format and apply syntax hilighting to a SQL statement string
 * @param query A SQL statement string
 */
export function colorizeQuery(query: string): string {
  return highlight(sqlFormatter.format(query), {
    language: 'sql',
    ignoreIllegals: true
  });
}

/**
 * A connection to a SQL database
 */
export abstract class SQLDatabase {
  /**
   * Asynchronously create a new database connection
   */
  public static async setup(): Promise<SQLDatabase> {
    return Promise.reject('Not yet implemented');
  }
  /**
   * A collection of prepared statements. This will be empty
   * until you do something to set it up.
   */
  public statements: {
    [key: string]: SQLPreparedStatement;
  };
  protected constructor() {
    this.statements = {};
  }
  /**
   * Shut down the database connection, closing any sockets, file streams, etc.. that may have
   * been opened in order to initially set up and establish it.
   */
  // tslint:disable-next-line:no-empty
  public async shutdown(): Promise<void> {}
  /**
   * Execute a SQL statement, and return the last inserted record's ID
   * @param sql SQL statement string
   * @param params Values to fill in any placeholders present in the SQL string
   */
  public abstract async run(sql: string, ...params: any[]): Promise<{ lastID: string } | void>;
  /**
   * Run a SQL query (usually a SELECT) and return a single record
   * @param sql SQL statement string
   * @param params Values to fill in any placeholders present in the SQL string
   */
  public abstract async get<T = any>(sql: string, ...params: any[]): Promise<T>;
  /**
   * Run a SQL query (usually a SELECT) and return a collection of records
   * @param sql SQL statement string
   * @param params Values to fill in any placeholders present in the SQL string
   */
  public abstract async all<T = any>(sql: string, ...params: any[]): Promise<T[]>;
  /**
   * Create a prepared statement from a SQL statement
   * @param sql SQL statement string
   * @param params Values to fill in any placeholders present in the SQL string. Additional values may be provided when the statement is executed
   */
  public abstract async prepare(
    name: string,
    sql: string,
    ...params: any[]
  ): Promise<SQLPreparedStatement>;

  /**
   * Get the names of all indices associated with a SQL table
   * @param tableName Table name
   */
  public abstract async getIndicesForTable(tableName: string): Promise<string[]>;
  /**
   * Get the names of all triggers in the database
   */
  public abstract async getAllTriggers(): Promise<string[]>;
  /**
   * Get the names of all stored procedures (functions) in the database
   */
  public abstract async getAllFunctions(): Promise<string[]>;
  /**
   * Get the names of all tables in the database
   */
  public abstract async getAllTableNames(): Promise<string[]>;
  /**
   * Get the names of all non-materialized views in the database
   */
  public abstract async getAllViews(): Promise<string[]>;
  /**
   * Get the names of all materialized views in the database
   */
  public abstract async getAllMaterializedViews(): Promise<string[]>;

  /**
   * Log a database query to the console
   * @param query SQL query to log
   * @param params values to place in SQL query's placeholders
   * @param t number of ms elapsed while query was running
   */
  protected logQuery(query: string, params: JSONArray, t: number) {
    let tv = timeVal(t);
    let timestring =
      t < 5
        ? chalk.bgGreenBright.black(tv)
        : t < 100 ? chalk.bgYellowBright.black(tv) : chalk.bgRedBright.white(tv);
    logger.info(
      [
        colorizeQuery(query) + ` (${timestring})`,
        `${chalk.grey('PARAMS:')} ${JSON.stringify(params)}`
      ].join('\n')
    );
    return t;
  }

  /**
   * Run a function that involves executing a SQL query, measure it and log the result to the console
   * @param query SQL query to log
   * @param params values to place in SQL query's placeholders
   * @param fn async function to invoke (and await)
   */
  protected async measure<T>(query: string, params: JSONArray, fn: () => Promise<T>): Promise<T> {
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
        TimingManager.current.addTime('db', t, 'Database');
      }
      return result;
    } catch (e) {
      logger.error(`Problem running query
${colorizeQuery(query)}
${chalk.yellow('PARAMS:')} ${JSON.stringify(params)}
${chalk.red('ERROR:')} ${e.toString()}`);
      throw e;
    }
  }
}
