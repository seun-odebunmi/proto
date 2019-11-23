import 'dotenv/config';
import { createServer } from 'http';

import { sequelize } from './models';
import { SERVER_CONFIG, GRAPHQL_ENDPOINT } from './constants';
import app from './server';

const server = createServer(app);
let currentApp = app;

sequelize
  .authenticate()
  .then(async () => {
    server.listen({ port: SERVER_CONFIG.port }, () => {
      console.log(`🚀  Server ready at ${GRAPHQL_ENDPOINT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

if (module.hot) {
  module.hot.accept(['./server'], () => {
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  });
}
