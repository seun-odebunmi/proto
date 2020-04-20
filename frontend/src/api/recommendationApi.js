import { putData } from './util';

export const createUpdateRecommendation = (data) => putData('/recommendation', data);
