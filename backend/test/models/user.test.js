import { models } from '../../src/models';

describe('Get all users', () => {
  test('It should return a list of users', () => {
    return models.User.getAll().then((response) => {
      expect(Array.isArray(response)).toBe(true);
    });
  });
});

describe('Get user by username', () => {
  test('It should return a single user', () => {
    return models.User.fetchUserByUsername('seunodebunmi').then((response) => {
      expect(response).toHaveProperty('name');
      expect(response).toHaveProperty('username');
    });
  });
});

describe('Check if a user exists', () => {
  test('It should return a single user', () => {
    return models.User.checkUserExists({ username: 'seunodebunmi' }).then((response) => {
      expect(response).toHaveProperty('name');
      expect(response).toHaveProperty('username');
    });
  });
});

describe('Check if a user that is not registered exists', () => {
  test('It should return null', () => {
    return models.User.checkUserExists({ username: 'seunodebs' }).then((response) => {
      expect(response).toBe(null);
    });
  });
});

describe('User login', () => {
  test('It should return a token and user information', () => {
    return models.User.login({ username: 'seunodebunmi', password: 'theguy' }).then((response) => {
      expect(response).toHaveProperty('token');
      expect(response).toHaveProperty('user');
    });
  });
});
