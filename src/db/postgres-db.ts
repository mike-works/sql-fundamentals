import chalk from 'chalk';
import * as pg from 'pg';
import { logger } from '../log';
import { sql } from '../sql-string';
import { SQLDatabase, SQLStatement } from './db';
import { setupPreparedStatements } from './prepared';

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
    if (query.toLowerCase().indexOf('insert into ') >= 0) {
      query = `${query} RETURNING id`;
    }
    logger.info(query);
    let res = await this.client.query(query, ...params);
    let lastID = null;
    if (res.rows && res.rows.length > 0) {
      lastID = res.rows[0].id;
    }
    return { lastID };
  }
  public async get<T>(query: string, ...params: any[]): Promise<T> {
    logger.info(query);
    let r = await this.client
      .query(query, params)
      .then(result => result.rows[0]);
    // console.log('row', r);
    return r;
  }
  public async all<T>(query: string, ...params: any[]): Promise<T[]> {
    logger.info(query);
    let rows = await this.client
      .query(query, params)
      .then(result => result.rows);
    // console.log('rows', rows);
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
      sql`select indexname
    from pg_indexes where tablename = \'${tableName}\'`
    )).map((result: any) => result.indexname as string);
  }
  public allTables(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
}
