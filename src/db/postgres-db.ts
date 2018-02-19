import chalk from 'chalk';
import * as pg from 'pg';
import { logger } from '../log';
import { sql } from '../sql-string';
import { SQLDatabase, SQLStatement } from './db';
import { setupPreparedStatements } from './prepared';
import { highlight } from 'cli-highlight';
import * as dbConfig from '../../database.json';

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

// tslint:disable-next-line:only-arrow-functions
const pool: pg.Pool = (function() {
  const {
    pg: { database, host, port, schema, user, password }
  } = dbConfig as any;
  let p = new pg.Pool(
    process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL }
      : {
          database,
          user,
          password,
          host,
          port
        }
  );
  if (process.env.NODE_ENV !== 'test') {
    logger.info(
      chalk.yellow(
        process.env.DATABASE_URL
          ? `Creating database pool for ${process.env.DATABASE_URL}`
          : `Creating database pool for postgres://${user}@${host}:${port}#${database}.${schema}`
      )
    );
  }
  return p;
})();

pool.on('error', (err, client) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// tslint:disable-next-line:max-classes-per-file
export default class PostgresDB extends SQLDatabase<PostgresStatement> {
  public static async setup(): Promise<PostgresDB> {
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
    } catch (e) {
      logger.error(`ERROR during posgres setup\n${e}`);
      throw e;
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
    if (
      query
        .toLowerCase()
        .trim()
        .indexOf('insert into ') >= 0
    ) {
      query = `${query} RETURNING id`;
    }
    return this.measure(query, params, async () => {
      let res = await this.client.query(query, params);
      let lastID = null;
      if (res.rows && res.rows.length > 0) {
        lastID = res.rows[0].id;
      }
      return { lastID };
    });
  }
  public async get<T>(query: string, ...params: any[]): Promise<T> {
    return this.measure(query, params, async () => {
      return await this.client
        .query(query, params)
        .then(result => result.rows[0]);
    });
  }
  public async all<T>(query: string, ...params: any[]): Promise<T[]> {
    return this.measure(query, params, async () => {
      return await this.client.query(query, params).then(result => result.rows);
    });
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
  public async getAllMaterializedViews(): Promise<string[]> {
    return (await this.all(
      sql`SELECT oid::regclass::text FROM pg_class WHERE  relkind = 'm'`
    )).map((result: any) => result.oid as string);
  }
  public async getAllViews(): Promise<string[]> {
    return (await this.all(
      sql`select viewname as name from pg_catalog.pg_views;`
    )).map((result: any) => result.name as string);
  }
  public async getAllTableNames(): Promise<string[]> {
    return (await this.all(
      sql`SELECT table_name as name
      FROM information_schema.tables
     WHERE table_schema='public'
       AND table_type='BASE TABLE';`
    )).map((result: any) => result.name as string);
  }
}
