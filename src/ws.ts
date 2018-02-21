import * as WS from 'ws';
import { Value as JSONValue } from 'json-typescript';
import { logger } from './log';

const WS_PORT = 40510;
const WS_HEARTBEAT_PULSE = 2000;

interface WebSocket extends WS {
  isAlive: boolean;
}

// tslint:disable-next-line:no-empty
function noop() {}

function heartbeat(this: WebSocket) {
  this.isAlive = true;
}

class WebSocketManager {
  private wss: WS.Server;
  private heartbeatInterval: number;
  public constructor() {
    this.wss = new WS.Server({ port: WS_PORT });
    logger.info(`Websocket Serving on ws://localhost:${WS_PORT}`);
    this.wss.on('connection', this.onConnect.bind(this));
    this.heartbeatInterval = setInterval(
      this.onHeartbeat.bind(this),
      WS_HEARTBEAT_PULSE
    );
  }
  public refreshAllClients() {
    this.broadcast('refresh');
  }
  protected broadcast(message: JSONValue) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WS.OPEN) {
        client.send(message);
      }
    });
  }

  protected onConnect(ws: WebSocket) {
    console.log('connect');
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on('message', this.onMessagereceived.bind(this));
    ws.on('error', (err: Error) => {
      console.error('WS ERROR', err.message);
    });
  }
  protected onMessagereceived(message: WS.Data) {
    console.log('received: %s', message);
  }

  private onHeartbeat() {
    this.cleanupClosedConnections();
  }
  private cleanupClosedConnections() {
    (this.wss.clients as Set<WebSocket>).forEach((ws: WebSocket) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping(noop);
    });
  }
}
let wsm = new WebSocketManager();
export default wsm;
