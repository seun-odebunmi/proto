import { models } from '../../src/models';

describe('Get all diagnosis', () => {
  test('It should return a list of diagnosis', () => {
    return models.Diagnosis.getAll().then((response) => {
      expect(Array.isArray(response)).toBe(true);
    });
  });
});

describe('Get diagnosis by id', () => {
  test('It should return a single diagnosis', () => {
    return models.Diagnosis.getById(10).then((response) => {
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('value');
    });
  });
});
