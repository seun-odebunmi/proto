import 'dotenv/config';
import server from './server';
import { models } from './models';
import { SERVER_CONFIG, ENDPOINT } from './config/config';

models.sequelize
  .sync()
  .then(async () => {
    server.listen({ port: SERVER_CONFIG.port }, () => {
      console.log(`🚀  Server ready at ${ENDPOINT}  `);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
