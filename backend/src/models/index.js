import Sequelize from 'sequelize';
import { DB_CONFIG } from '../constants';
const cls = require('continuation-local-storage'),
  namespace = cls.createNamespace('whitelabel-namespace');

Sequelize.cls = namespace;
const sequelize = new Sequelize(DB_CONFIG.url, DB_CONFIG.options);

let models = {};

const modules = [
  require('./auditTrail.js'),
  require('./pendingRequest.js'),
  require('./session.js'),
  require('./countries.js'),
  require('./institutions.js'),
  require('./branches.js'),
  require('./roles.js'),
  require('./menus.js'),
  require('./roleFunctions.js'),
  require('./users.js')
];

// Initialize models
modules.forEach(module => {
  const model = module.default(sequelize, Sequelize, DB_CONFIG);
  models[model.name] = model;
});

// Apply associations
Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export { sequelize, models };
