import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import RiveScript from 'rivescript';

import { models } from './models';
import { subRoutines } from './brain/subRoutines';
import { routerAll } from './routes';
import { SERVER_CONFIG, ENDPOINT } from './config/config';

const bot = new RiveScript({ utf8: true });
const brains = ['src/brain/brain.rive'];

bot
  .loadFile(brains)
  .then(() => {
    bot.sortReplies();
    const app = express();
    const router = express.Router();
    app.use(express.json());
    app.use(cors(), helmet());
    app.use('/', router);
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send(err.message);
    });
    subRoutines(models, bot);
    routerAll(router, models, bot);

    models.sequelize
      .sync()
      .then(async () => {
        app.listen({ port: SERVER_CONFIG.port }, () => {
          console.log(`🚀  Server ready at ${ENDPOINT}  `);
        });
      })
      .catch((err) => {
        console.error('Unable to connect to the database:', err);
      });
  })
  .catch((loadcount, err) => console.log('Error loading batch #' + loadcount + ': ' + err + '\n'));
