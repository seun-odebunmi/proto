const request = require('supertest');
import server from '../../src/server';

describe('Get Endpoint', () => {
  it('should redirect to long url', async done => {
    const res = await request(server).get('/url/:code');
    expect(res.statusCode).toEqual(302);
    done();
  });
});
