import * as pg from 'pg';
import wsm from '../ws';
import { logger } from '../log';

export async function setupPubSub(pool: pg.Pool): Promise<pg.Client> {
  const client = await pool.connect();
  client.on('notification', (message: pg.Notification) => {
    if (message.channel === 'table_update' && typeof message.payload === 'string') {
      try {
        let payload = JSON.parse(message.payload);
        wsm().refreshAllClients();
      } catch (e) {
        logger.error(e);
      }
    }
  });
  client.query('LISTEN table_update;');
  return client;
}
