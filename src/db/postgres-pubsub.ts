import * as pg from 'pg';
import { logger } from '../log';
import wsm from '../ws';

export async function setupPubSub(pool: pg.Pool): Promise<pg.Client> {
  const client = await pool.connect();

  client.on('notification', (message: pg.Notification) => {
    if (
      message.channel === 'table_update' &&
      typeof message.payload === 'string'
    ) {
      try {
        let payloadJson = JSON.parse(message.payload);
        if (payloadJson.table === 'order') {
          logger.debug(
            'ORDER table change detected! refreshing all clients',
            payloadJson
          );
          let webSocketManager = wsm();
          if (webSocketManager) {
            webSocketManager.refreshAllClients();
          }
        } else {
          logger.debug(
            'Received table_update payload, but ignoring it',
            payloadJson
          );
        }
      } catch (e) {
        logger.error(
          `Improperly formatted Postgres notification on table_update channel: ${
            message.payload
          }`
        );
      }
    }
  });
  client.query('LISTEN table_update');
  return client;
}
