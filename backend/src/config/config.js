import * as envConfig from './config.json';

const { NODE_PORT, NODE_HOST, NODE_ENV } = process.env;
const env = NODE_ENV || 'development';
const { dialect, username, password, host, port, database } = envConfig.default[env];

const serverConfig = {
  production: {
    env: 'production',
    ssl: true,
    port: NODE_PORT,
    hostname: NODE_HOST,
  },
  test: {
    env: 'test',
    ssl: false,
    port: 4000,
    hostname: 'localhost',
  },
  development: {
    env: 'development',
    ssl: false,
    port: 4000,
    hostname: 'localhost',
  },
};

export const SERVER_CONFIG = serverConfig[env];
export const ENDPOINT = `http://${SERVER_CONFIG.hostname}:${SERVER_CONFIG.port}`;

export const config = {
  url: `${dialect}://${username}:${password}@${host}:${port}/${database}`,
  database: database,
  username: username,
  password: password,
  options: {
    host: host,
    port: port,
    dialect: dialect,
    define: {
      freezeTableName: false,
      timestamps: false,
    },
  },
  // pool configuration used to pool database connections
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
  },
};
