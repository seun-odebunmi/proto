const { NODE_PORT, NODE_HOST, NODE_ENV } = process.env;

const configurations = {
  production: {
    ssl: true,
    port: NODE_PORT,
    hostname: NODE_HOST
  },
  development: {
    ssl: false,
    port: 4000,
    hostname: 'localhost'
  }
};
const environment = NODE_ENV || 'production';

const SERVER_CONFIG = configurations[environment];
const GRAPHQL_ENDPOINT = `http://${SERVER_CONFIG.hostname}:${
  SERVER_CONFIG.port
}/graphql`;

export { SERVER_CONFIG, GRAPHQL_ENDPOINT };
