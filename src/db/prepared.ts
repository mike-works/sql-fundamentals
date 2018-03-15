import { SQLDatabase, SQLStatement } from './db';

interface PreparedStatementMap {
  [k: string]: SQLStatement;
}

/**
 * Initialize client-side prepared statements as part
 * of creating a new database connection
 * @param db A PostgreSQL, SQLite or MySQL Database connection
 * @returns {Promise<PreparedStatementMap>}
 */
export async function setupPreparedStatements(
  db: SQLDatabase
): Promise<PreparedStatementMap> {
  return {};
}
