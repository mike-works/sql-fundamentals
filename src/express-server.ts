import * as express from 'express';
import * as exphbs from 'express-handlebars';
import * as expressWinston from 'express-winston';
import * as http from 'http';
import * as winston from 'winston';
import { PORT } from './constants';
import router from './routes/main';
import { logger } from './utils';

async function startListening(app: express.Express): Promise<http.Server> {
  return new Promise<http.Server>((res, rej) => {
    const server = app.listen(PORT, () => {
      logger.info('Server listening on http://localhost:3000');
      res(server);
    });
  });
}

function setupTemplating(app: express.Application) {
  app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
  }));
  app.set('view engine', '.hbs');
}

function installMiddlewares(app: express.Application) {
  app.use(expressWinston.logger({
    // expressFormat: true,
    meta: false,
    msg: '{{req.method}}: {{res.statusCode}} ({{res.responseTime}}ms) {{req.url}}',
    transports: [
      new winston.transports.Console({
        colorize: true
      })
    ],
    skip(req: express.Request, res: express.Response) {
      return /^\/static\//.test(req.path);
    }
  }));

}

function setupRouting(app: express.Application) {
  app.use(router);
  app.use('/static', express.static('public'));
}

export async function startExpressServer(): Promise<[express.Application, http.Server]> {
  const app = express();
  app.disable('x-powered-by');

  setupTemplating(app);
  installMiddlewares(app);
  setupRouting(app);

  const server = await startListening(app);
  return [app, server];
}
