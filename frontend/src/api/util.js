import axios from 'axios';
import history from '../history';

axios.defaults.baseURL = 'http://84.203.110.21:4000';
const access_token = localStorage.getItem('token');
if (access_token) {
  axios.defaults.headers.common['Authorization'] = access_token;
}

export const setHeaderToken = (token) => {
  axios.defaults.headers.common['Authorization'] = token;
};

const handleLogOut = (history) => {
  localStorage.clear();
  history.replace({
    pathname: '/login',
  });
};

const handleError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 401) {
      handleLogOut(history);
    } else {
      const errMsg =
        (data.error && (data.error.length ? data.error[0] : data.error)) ||
        data.status_description ||
        data.message ||
        'An error occurred';
      console.error(errMsg);
    }
  } else {
    console.log(error);
  }
};

export async function getData(url = '', params = {}) {
  return await axios
    .request({
      url,
      method: 'get',
      params,
    })
    .then((d) => d.data)
    .catch((err) => handleError(err));
}

export async function postData(url = '', data = {}) {
  return await axios
    .request({
      url,
      method: 'post',
      data,
    })
    .then((d) => d.data)
    .catch((err) => handleError(err));
}

export async function putData(url = '', data = {}) {
  return await axios
    .request({
      url,
      method: 'put',
      data,
    })
    .then((d) => d.data)
    .catch((err) => handleError(err));
}

export async function deleteData(url = '') {
  return await axios
    .request({
      url,
      method: 'delete',
    })
    .catch((err) => handleError(err));
}
