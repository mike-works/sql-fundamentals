import chalk from 'chalk';
import * as mysql2 from 'mysql2/promise';

import * as dbConfig from '../../database.json';
import { logger } from '../log';
import { sql } from '../sql-string';

import { SQLDatabase, SQLPreparedStatement } from './db';
import { setupPreparedStatements } from './prepared';

class MySQLPreparedStatement implements SQLPreparedStatement {
  protected name: string;
  protected text: string;
  protected values: any[];
  protected conn: mysql2.Connection;
  protected statement: Promise<any>;
  public constructor(name: string, text: string, values: any[], conn: mysql2.Connection) {
    this.name = name;
    this.text = text;
    this.values = values;
    this.conn = conn;
    this.statement = (conn as any).prepare(text);
  }
  public async get<T>(...params: any[]): Promise<T> {
    let statement = await this.statement;
    let [rows, _] = await statement.execute(params);
    return rows[0];
  }
  public async all<T>(...params: any[]): Promise<T[]> {
    let statement = await this.statement;
    let [rows, _] = await statement.execute(params);
    return rows;
  }
}

// tslint:disable-next-line:only-arrow-functions
const pool: mysql2.Pool = (function() {
  const { database, host, port, user, password } = dbConfig.mysql;
  let p: mysql2.Pool = mysql2.createPool({
    connectionLimit: 10,
    host,
    user,
    password,
    database,
    port
  });

  if (process.env.NODE_ENV !== 'test') {
    logger.info(
      chalk.yellow(
        process.env.DATABASE_URL
          ? `Creating database pool for ${process.env.DATABASE_URL}`
          : `Creating database pool for mysql://${user}@${host}:${port}#${database}`
      )
    );
  }
  return p;
})();

(pool as any).on('error', (err: Error) => {
  logger.error('Unexpected error on idle client', err.message);
  process.exit(-1);
});

// tslint:disable-next-line:max-classes-per-file
export default class MySQLDB extends SQLDatabase {
  public static async setup(): Promise<MySQLDB> {
    const client = await pool.getConnection();
    try {
      let mysqldb = new this(client);
      // let data = await mysqldb.get(sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
      // console.log('DATA: ', data);
      mysqldb.statements = await setupPreparedStatements(mysqldb);
      // if (!this.pubSubSupport) {
      //   this.pubSubSupport = await setupPubSub(pool);
      // }
      return mysqldb;
    } catch (e) {
      logger.error(`ERROR during posgres setup\n${e}`);
      throw e;
    } finally {
      client.release();
    }
  }
  // private static pubSubSupport: pg.Client;
  private connection: mysql2.Connection;

  protected constructor(connection: mysql2.Connection) {
    super();
    this.connection = connection;
  }
  // tslint:disable-next-line:no-empty
  public async shutdown(): Promise<void> {
    // PostgresDB.pubSubSupport.release();
    await pool.end();
  }
  public async run(query: string, ...params: any[]): Promise<{ lastID: string } | void> {
    let q = this.normalizeQuery(query);

    return this.measure(q, params, async () => {
      let [res, _] = await this.connection.query(q, params);
      if (res && typeof (res as any).insertId !== 'undefined') {
        let lastID = (res as any).insertId;
        return { lastID };
      }
    });
  }
  public async get<T>(query: string, ...params: any[]): Promise<T> {
    let q = this.normalizeQuery(query);
    return this.measure(q, params, async () => {
      return await this.connection.query(q, params).then(([result, _]) => (result as T[])[0]);
    });
  }
  public async all<T>(query: string, ...params: any[]): Promise<T[]> {
    let q = this.normalizeQuery(query);
    return this.measure(q, params, async () => {
      return await this.connection.query(q, params).then(([result, _]) => result as T[]);
    });
  }
  public prepare(name: string, query: string, ...params: any[]): Promise<MySQLPreparedStatement> {
    let q = this.normalizeQuery(query);
    return Promise.resolve(new MySQLPreparedStatement(name, q, params, this.connection));
  }
  public async getIndicesForTable(tableName: string): Promise<string[]> {
    return (await this.all(sql`SHOW INDEX FROM ${tableName}`)).map(
      (result: any) => result.Key_name as string
    );
  }
  public async getAllTriggers(): Promise<string[]> {
    return (await this.all(sql`SHOW TRIGGERS`)).map((result: any) => result.Trigger as string);
  }
  public async getAllMaterializedViews(): Promise<string[]> {
    throw new Error('getAllMaterializedViews() not yet implemented');
  }
  public async getAllViews(): Promise<string[]> {
    return (await this.all(sql`SHOW FULL TABLES IN northwind WHERE TABLE_TYPE LIKE 'VIEW'`)).map(
      (result: any) => result.Tables_in_northwind as string
    );
  }
  public async getAllFunctions(): Promise<string[]> {
    throw new Error('getAllFunctions() not yet implemented');
  }
  public async getAllTableNames(): Promise<string[]> {
    return (await this.all(
      sql`SELECT TABLE_NAME AS name FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'northwind'`
    )).map((result: any) => result.name as string);
  }

  private normalizeQuery(str: string): string {
    return str.replace(/\$\s*[0-9]+/g, '?');
  }
}
