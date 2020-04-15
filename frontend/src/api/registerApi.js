import { postData } from './util';

export const registerApi = (param) => postData('/register/', param);
