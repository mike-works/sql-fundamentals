import * as pg from 'pg';

export async function setupPubSub(pool: pg.Pool): Promise<pg.Client> {
  const client = await pool.connect();

  return client;
}
