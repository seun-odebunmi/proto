import { models } from '../../src/models';

describe('Get all medical records', () => {
  test('It should return a list of medical records', () => {
    return models.MedicalRecords.getAll().then((response) => {
      expect(Array.isArray(response)).toBe(true);
    });
  });
});

describe('Get all medical records by user id', () => {
  test('It should return a list of medical records', () => {
    const args = { user_id: 1, page: 0, size: 10, sortBy: ['date', 'DESC'] };
    return models.MedicalRecords.getByUserId(args).then((response) => {
      expect(Array.isArray(response)).toBe(true);
    });
  });
});
