import * as express from 'express';
import * as exphbs from 'express-handlebars';
import * as expressWinston from 'express-winston';
import * as http from 'http';
import * as winston from 'winston';
import { PORT } from './constants';
import { loadHandlebarsHelpers } from './load-helpers';
import { logger } from './log';
import router from './routers/main';

async function startListening(app: express.Express): Promise<http.Server> {
  return new Promise<http.Server>((res, rej) => {
    const server = app.listen(PORT, () => {
      logger.info('Server listening on http://localhost:3000');
      res(server);
    });
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
}

function installMiddlewares(app: express.Application) {
  app.use(
    expressWinston.logger({
      // expressFormat: true,
      meta: false,
      msg:
        '{{req.method}}: {{res.statusCode}} ({{res.responseTime}}ms)\t{{req.url}}',
      transports: [
        new winston.transports.Console({
          colorize: true
        })
      ],
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

export async function startExpressServer(): Promise<
  [express.Application, http.Server]
> {
  const app = express();

  if (process.env.NODE_ENV !== 'prod') {
    await setupDevMiddleware(app);
  } else {
    await setupProdMiddleware(app);
  }

  await setupTemplating(app);
  await installMiddlewares(app);
  await setupRouting(app);

  const server = await startListening(app);
  return [app, server];
}
