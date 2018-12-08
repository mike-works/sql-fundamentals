import chalk from 'chalk';
import * as pg from 'pg';

import * as dbConfig from '../../database.json';
import { logger } from '../log';
import { sql } from '../sql-string';

import { SQLDatabase, SQLPreparedStatement } from './db';
import { setupPubSub } from './postgres-pubsub';
import { setupPreparedStatements } from './prepared';

class PostgresPreparedStatement implements SQLPreparedStatement {
  protected name: string;
  protected text: string;
  protected values: any[];
  protected client: pg.PoolClient;
  public constructor(name: string, text: string, values: any[], client: pg.PoolClient) {
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
  const { database, host, port, schema, user, password } = dbConfig.pg;
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
export default class PostgresDB extends SQLDatabase {
  public static async setup(): Promise<PostgresDB> {
    const client = await pool.connect();
    try {
      let pgdb = new this(client);
      // let data = await pgdb.get(sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
      // console.log('DATA: ', data);
      pgdb.statements = await setupPreparedStatements(pgdb);
      if (!this.pubSubSupport) {
        this.pubSubSupport = await setupPubSub(pool);
      }
      return pgdb;
    } catch (e) {
      logger.error(`ERROR during posgres setup\n${e}`);
      throw e;
    } finally {
      client.release();
    }
  }
  private static pubSubSupport: pg.PoolClient;
  private client: pg.PoolClient;

  protected constructor(client: pg.PoolClient) {
    super();
    this.client = client;
  }
  // tslint:disable-next-line:no-empty
  public async shutdown(): Promise<void> {
    PostgresDB.pubSubSupport.release();
    await pool.end();
  }
  public async run(query: string, ...params: any[]): Promise<{ lastID: string } | void> {
    let q = query.toLowerCase().trim();
    if (q.indexOf('insert into ') >= 0) {
      if (q[q.length - 1] === ';') {
        query = `${query.substr(0, query.length - 1)} RETURNING id;`;
      } else {
        query = `${query} RETURNING id;`;
      }
    }
    return this.measure(query, params, async () => {
      let res = await this.client.query(query, params);
      if (res.rows && res.rows.length > 0) {
        let lastID = null;
        lastID = res.rows[0].id;
        if (lastID === null) {
          throw new Error('Did not return a lastID');
        }
        return { lastID };
      }
    });
  }
  public async get<T>(query: string, ...params: any[]): Promise<T> {
    return this.measure(query, params, async () => {
      return await this.client.query(query, params).then(result => result.rows[0]);
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
  ): Promise<PostgresPreparedStatement> {
    return Promise.resolve(new PostgresPreparedStatement(name, query, params, this.client));
  }
  public async getIndicesForTable(tableName: string): Promise<string[]> {
    return (await this.all(sql`SELECT indexname AS name
    FROM pg_indexes WHERE tablename = \'${tableName.toLowerCase()}\'`)).map(
      (result: any) => result.name as string
    );
  }
  public async getAllTriggers(): Promise<string[]> {
    return (await this.all(sql`SELECT tgname AS name FROM pg_trigger,pg_proc WHERE
    pg_proc.oid=pg_trigger.tgfoid AND tgisinternal = false`)).map(
      (result: any) => result.name as string
    );
  }
  public async getAllMaterializedViews(): Promise<string[]> {
    return (await this.all(sql`SELECT oid::regclass::text FROM pg_class WHERE  relkind = 'm'`)).map(
      (result: any) => result.oid as string
    );
  }
  public async getAllViews(): Promise<string[]> {
    return (await this.all(sql`select viewname as name from pg_catalog.pg_views;`)).map(
      (result: any) => result.name as string
    );
  }
  public async getAllFunctions(): Promise<string[]> {
    return (await this.all(sql`SELECT routines.routine_name as name
FROM information_schema.routines
    LEFT JOIN information_schema.parameters ON routines.specific_name=parameters.specific_name
WHERE routines.specific_schema='public'
ORDER BY routines.routine_name, parameters.ordinal_position;`)).map(
      (result: any) => result.name as string
    );
  }
  public async getAllTableNames(): Promise<string[]> {
    return (await this.all(sql`SELECT table_name as name
      FROM information_schema.tables
     WHERE table_schema='public'
       AND table_type='BASE TABLE';`)).map((result: any) => result.name as string);
  }
}
