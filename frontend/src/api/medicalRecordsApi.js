import { getData } from './util';

export const getMedicalRecords = (params) => getData('/medical-records', params);
export const getPatMedicalRecords = (params) => getData('/patient/medical-records', params);
