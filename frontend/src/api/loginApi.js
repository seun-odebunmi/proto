import { postData, setHeaderToken } from './util';

export const loginApi = (param) => postData('/login/', param);
export const setToken = (token) => setHeaderToken(token);
