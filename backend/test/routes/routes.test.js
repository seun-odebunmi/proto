import Helper from '../helper';
const helper = new Helper();

let token;
let token2;
let user;

beforeAll((done) => {
  const login = { username: 'seunodebunmi', password: 'theguy' };
  const login2 = { username: 'davidmark', password: 'theguy' };

  helper.apiServer
    .post('http://localhost:4000/login')
    .send(login)
    .end((err, response) => {
      token = response.body.token;
      user = response.body.user;
    });

  helper.apiServer
    .post('http://localhost:4000/login')
    .send(login2)
    .end((err, response) => {
      token2 = response.body.token;
    });

  if (token != '' && token2 != '') {
    done();
  }
});

describe('Login with valid credentials', () => {
  test('It should login successfully and return a token and user information', () => {
    const login = { username: 'seunodebunmi', password: 'theguy' };
    return helper.apiServer
      .post('http://localhost:4000/login')
      .send(login)
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
      });
  });
});

describe('Login with invalid credentials', () => {
  test('It should throw an error', () => {
    const login = { username: 'seunodebunmi', password: 'theguy01' };
    return helper.apiServer
      .post('http://localhost:4000/login')
      .send(login)
      .then((response) => {
        expect(response.statusCode).toEqual(500);
      });
  });
});

describe('Initiate Bot without authorization', () => {
  test('It should return with 401 aunauthorized error', () => {
    return helper.apiServer.get('http://localhost:4000/botInit').then((response) => {
      expect(response.statusCode).toEqual(401);
    });
  });
});

describe('Initiate Bot with authorization', () => {
  test('It should respond with a message and answer options', () => {
    return helper.apiServer
      .get('http://localhost:4000/botInit')
      .set('Authorization', `${token}`)
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('msg');
        expect(response.body).toHaveProperty('taOptions');
      });
  });
});

describe('Converse with Bot', () => {
  test('It should respond with a message and answer options', () => {
    return helper.apiServer
      .post('http://localhost:4000/botReply')
      .set('Authorization', `${token}`)
      .send({ msg: 'yes, begin' })
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.type).toEqual('application/json');
        expect(response.body).toHaveProperty('msg');
        expect(response.body).toHaveProperty('taOptions');
      });
  });
});

describe('Get Recommendation of all patients by a patient', () => {
  test('It should return with 403 forbidden error', () => {
    const params = { page: 0, size: 10, sortBy: 'date, DESC' };
    return helper.apiServer
      .get('http://localhost:4000/patient/medical-records')
      .set('Authorization', `${token}`)
      .send(params)
      .then((response) => {
        expect(response.statusCode).toEqual(403);
      });
  });
});

describe('Get Medical records by a patient', () => {
  test('It should return with records', () => {
    const params = { user_id: user.id, page: 0, size: 10, sortBy: 'date, DESC' };
    return helper.apiServer
      .get('http://localhost:4000/medical-records')
      .set('Authorization', `${token}`)
      .send(params)
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.type).toEqual('application/json');
        expect(Array.isArray(response.body)).toBe(true);
      });
  });
});

describe('Get Recommendation of all patients by a GP', () => {
  test('It should return with records', () => {
    const params = { page: 0, size: 10, sortBy: 'date, DESC' };
    return helper.apiServer
      .get('http://localhost:4000/patient/medical-records')
      .set('Authorization', `${token2}`)
      .send(params)
      .then((response) => {
        expect(response.statusCode).toEqual(200);
        expect(response.type).toEqual('application/json');
        expect(Array.isArray(response.body)).toBe(true);
      });
  });
});
