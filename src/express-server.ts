import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as exphbs from 'express-handlebars';
import * as expressWinston from 'express-winston';
import * as http from 'http';
import * as serverTiming from 'server-timing';
import * as winston from 'winston';

import { PORT } from './constants';
import { loadHandlebarsHelpers } from './load-helpers';
import { logger } from './log';
import router from './routers/main';
import TimingManager from './timing';
import { setup as setupWebsocketServer } from './ws';

async function startListening(app: express.Express): Promise<http.Server> {
  return new Promise<http.Server>((res, rej) => {
    const server = app.listen(PORT, () => {
      logger.info(`Server listening on http://localhost:${PORT}`);
      res(server);
    });
    setupWebsocketServer(server);
  });
}

async function setupTemplating(app: express.Application) {
  app.engine(
    '.hbs',
    exphbs({
      defaultLayout: 'main',
      extname: '.hbs',
      helpers: await loadHandlebarsHelpers()
    })
  );
  app.set('view engine', '.hbs');
  app.use((req, res, next) => {
    let { url, query } = req;
    res.locals.request = { url, query };
    next();
  });
}

function installMiddlewares(app: express.Application) {
  app.use(serverTiming());
  app.use((req, res, next) => {
    TimingManager.reset(res);
    next();
  });
  app.use(
    expressWinston.logger({
      // expressFormat: true,
      meta: false,
      msg: '{{req.method}}: {{res.statusCode}} ({{res.responseTime}}ms)\t{{req.url}}',
      transports: [new winston.transports.Console()],
      skip(req: express.Request, res: express.Response) {
        return /^\/static\//.test(req.path);
      }
    })
  );
}

async function setupRouting(app: express.Application) {
  app.use(router);

  app.use('/static', express.static('public'));
}

async function setupDevMiddleware(app: express.Application) {
  app.enable('x-powered-by');
}

async function setupProdMiddleware(app: express.Application) {
  app.disable('x-powered-by');
}

export async function startExpressServer(): Promise<[express.Application, http.Server]> {
  const app = express();

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));

  // parse application/json
  app.use(bodyParser.json());

  if (process.env.NODE_ENV !== 'prod') {
    await setupDevMiddleware(app);
  } else {
    await setupProdMiddleware(app);
  }

  await setupTemplating(app);
  installMiddlewares(app);

  await setupRouting(app);

  const server = await startListening(app);
  return [app, server];
}
