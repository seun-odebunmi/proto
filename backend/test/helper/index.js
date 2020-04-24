const supertest = require('supertest');
import server from '../../src/index';
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

class Helper {
  constructor(model) {
    this.server = server;
    this.apiServer = supertest(server);
  }
}

export default Helper;
