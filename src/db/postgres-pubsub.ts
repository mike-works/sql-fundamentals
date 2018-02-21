import * as pg from 'pg';

export async function setupPubSub(pool: pg.Pool) {
  const client = await pool.connect();
}
