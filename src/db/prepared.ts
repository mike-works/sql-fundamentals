import { SQLDatabase, SQLPreparedStatement } from './db';

interface PreparedStatementMap {
  [k: string]: SQLPreparedStatement;
}

/**
 * Initialize client-side prepared statements as part
 * of creating a new database connection
 * @param db A PostgreSQL, SQLite or MySQL Database connection
 * @returns {Promise<PreparedStatementMap>}
 */
export async function setupPreparedStatements(db: SQLDatabase): Promise<PreparedStatementMap> {
  /**
   * Replace the body of this function with something that returns
   * an object whose keys are strings and values are prepared statements
   *
   * @example
   *
   *    return {
   *      getOrder: <a prepared statement>
   *    }
   *
   */
  return {};
}
