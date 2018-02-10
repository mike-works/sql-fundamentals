import chalk from 'chalk';
import * as pg from 'pg';
import { logger } from '../log';
import { sql } from '../sql-string';
import { SQLDatabase, SQLStatement } from './db';
import { setupPreparedStatements } from './prepared';
import { highlight } from 'cli-highlight';

class PostgresStatement implements SQLStatement {
  protected name: string;
  protected text: string;
  protected values: any[];
  protected client: pg.Client;
  public constructor(
    name: string,
    text: string,
    values: any[],
    client: pg.Client
  ) {
    this.client = client;
    this.name = name;
    this.text = text;
    this.values = values;
  }
  public async get<T>(...params: any[]): Promise<T> {
    let res = await this.client.query({
      text: this.text,
      name: this.name,
      values: params
    });
    return res.rows[0];
  }
  public async all<T>(...params: any[]): Promise<T[]> {
    let res = await this.client.query({
      text: this.text,
      name: this.name,
      values: params
    });
    return res.rows;
  }
}

const pool: pg.Pool = new pg.Pool({
  database: 'nw_postgresql',
  host: 'localhost',
  port: 5432
});

pool.on('error', (err, client) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// tslint:disable-next-line:max-classes-per-file
export default class PostgresDB extends SQLDatabase<PostgresStatement> {
  public static async setup(opts: {
    name: string;
    host: string;
    port: number;
  }): Promise<PostgresDB> {
    const client = await pool.connect();
    try {
      let pgdb = new this(client);
      // let data = await pgdb.get(sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
      // console.log('DATA: ', data);
      pgdb.statements = await setupPreparedStatements<
        PostgresStatement,
        PostgresDB
      >(pgdb);
      return pgdb;
    } finally {
      client.release();
    }
  }
  private client: pg.Client;
  protected constructor(client: pg.Client) {
    super();
    this.client = client;
  }

  public async run(
    query: string,
    ...params: any[]
  ): Promise<{ lastID: number | string }> {
    let [, begin] = process.hrtime();
    if (query.toLowerCase().indexOf('insert into ') >= 0) {
      query = `${query} RETURNING id`;
    }
    if (process.env.NODE_ENV !== 'test') {
      let [, end] = process.hrtime();
      logger.info(
        [
          `
${chalk.magentaBright('>>')} ${highlight(query.trim(), {
            language: 'sql',
            ignoreIllegals: true
          })}`,
          `(${chalk.yellow(`${((end - begin) / 1000000).toPrecision(2)}ms`)})`
        ].join(' ')
      );
    }
    let res = await this.client.query(query, params);
    let lastID = null;
    if (res.rows && res.rows.length > 0) {
      lastID = res.rows[0].id;
    }
    return { lastID };
  }
  public async get<T>(query: string, ...params: any[]): Promise<T> {
    let [, begin] = process.hrtime();
    let r = await this.client
      .query(query, params)
      .then(result => result.rows[0]);
    if (process.env.NODE_ENV !== 'test') {
      let [, end] = process.hrtime();
      logger.info(
        [
          `
${chalk.magentaBright('>>')} ${highlight(query.trim(), {
            language: 'sql',
            ignoreIllegals: true
          })}`,
          `(${chalk.yellow(`${((end - begin) / 1000000).toPrecision(2)}ms`)})`
        ].join(' ')
      );
    }
    return r;
  }
  public async all<T>(query: string, ...params: any[]): Promise<T[]> {
    let [, begin] = process.hrtime();
    let rows = await this.client
      .query(query, params)
      .then(result => result.rows);
    if (process.env.NODE_ENV !== 'test') {
      let [, end] = process.hrtime();
      logger.info(
        [
          `
${chalk.magentaBright('>>')} ${highlight(query.trim(), {
            language: 'sql',
            ignoreIllegals: true
          })}`,
          `(${chalk.yellow(`${((end - begin) / 1000000).toPrecision(2)}ms`)})`
        ].join(' ')
      );
    }
    return rows;
  }
  public prepare(
    name: string,
    query: string,
    ...params: any[]
  ): Promise<PostgresStatement> {
    return Promise.resolve(
      new PostgresStatement(name, query, params, this.client)
    );
  }
  public async getIndicesForTable(tableName: string): Promise<string[]> {
    return (await this.all(
      sql`select indexname as name
    from pg_indexes where tablename = \'${tableName}\'`
    )).map((result: any) => result.name as string);
  }
  public async getAllTriggers(): Promise<string[]> {
    return (await this
      .all(sql`select tgname as name from pg_trigger,pg_proc where
    pg_proc.oid=pg_trigger.tgfoid AND tgisinternal = false`)).map(
      (result: any) => result.name as string
    );
  }
  public async getAllViews(): Promise<string[]> {
    return (await this.all(
      sql`select viewname as name from pg_catalog.pg_views;`
    )).map((result: any) => result.name as string);
  }
}
