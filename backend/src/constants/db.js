const {
  NODE_DATABASE_TYPE,
  NODE_DATABASE_USER,
  NODE_DATABASE_PASSWORD,
  NODE_DATABASE_HOST,
  NODE_DATABASE_PORT,
  NODE_DATABASE
} = process.env;

export const DB_CONFIG = {
  url: `${NODE_DATABASE_TYPE}://${NODE_DATABASE_USER}:${NODE_DATABASE_PASSWORD}@${NODE_DATABASE_HOST}:${NODE_DATABASE_PORT}/${NODE_DATABASE}`,
  database: NODE_DATABASE,
  username: NODE_DATABASE_USER,
  password: NODE_DATABASE_PASSWORD,
  options: {
    host: NODE_DATABASE_HOST,
    port: NODE_DATABASE_PORT,
    dialect: NODE_DATABASE_TYPE,
    define: {
      freezeTableName: false,
      timestamps: false
    }
  },
  // pool configuration used to pool database connections
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000
  }
};
