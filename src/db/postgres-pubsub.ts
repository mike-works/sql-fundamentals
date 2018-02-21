import * as pg from 'pg';
import webSocketManager from '../ws';
import { logger } from '../log';

export async function setupPubSub(pool: pg.Pool): Promise<pg.Client> {
  const client = await pool.connect();

  return client;
}
