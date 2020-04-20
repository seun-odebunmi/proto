const Sequelize = require('sequelize');
import { config } from '../config/config';

const models = {};

let sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const modules = [
  require('./diagnosis.js'),
  require('./visualAcuity.js'),
  require('./recommendation.js'),
  require('./medicalRecords.js'),
  require('./user.js'),
];

// Initialize models
modules.forEach((modul) => {
  const model = modul.default(sequelize, Sequelize, config);
  models[model.name] = model;
});

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export { models };
