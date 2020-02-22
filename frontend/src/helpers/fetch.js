const baseUrl = 'http://localhost:4000';

export async function postData(url = '', data = {}, headers = {}) {
  const response = await fetch(baseUrl + url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return await response.json();
}

export async function getData(url = '', headers = {}) {
  const response = await fetch(baseUrl + url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });
  return await response.json();
}
