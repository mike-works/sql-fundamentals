import * as express from 'express';
import * as exphbs from 'express-handlebars';
import { PORT } from './constants';
import router from './routes/main';
import { logger } from './utils';

async function startListening(app: express.Express) {
  return new Promise((res, rej) => {
    const server = app.listen(PORT, () => {
      logger.info('Server listening on http://localhost:3000');
      res(server);
    });
  });
}

export async function startExpressServer() {
  const app = express();
  app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
  }));
  app.set('view engine', '.hbs');
  app.disable('x-powered-by');
  app.use(router);
  app.use('/static', express.static('public'));
  const server = await startListening(app);
  return { server, app };
}
