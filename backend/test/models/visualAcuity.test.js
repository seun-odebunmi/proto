import { models } from '../../src/models';

describe('Get all visual acuity values', () => {
  test('It should return a list of visual acuity values', () => {
    return models.VisualAcuity.getAll().then((response) => {
      expect(Array.isArray(response)).toBe(true);
    });
  });
});

describe('Get visual acuity value by id', () => {
  test('It should return a single visual acuity value', () => {
    return models.VisualAcuity.getById(5).then((response) => {
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('value');
    });
  });
});
