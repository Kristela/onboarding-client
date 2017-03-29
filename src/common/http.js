import uuid from 'uuid/v4';

export function resetStatisticsIdentification() {
  localStorage.setItem('statisticsId', uuid());
}

function getStatisticsId() {
  // Generate a random id to gather statistics without tying to a specific person.
  if (!localStorage.getItem('statisticsId')) {
    resetStatisticsIdentification();
  }
  return localStorage.getItem('statisticsId');
}

function createStatisticsHeaders() {
  return { 'x-statistics-identifier': getStatisticsId() };
}

function transformResponse(response) {
  if (response.ok && response.status < 400) {
    return response.json();
  } else if (response.status >= 400) {
    return response
      .json()
      .then((data) => {
        const error = {};
        error.status = response.status;
        error.body = data;
        throw error;
      });
  }
  throw response;
}

function transformFileResponse(response) {
  if (response.ok && response.status < 400) {
    return response.blob();
  }
  throw response;
}

function urlEncodeParameters(params) {
  return Object
    .keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

export function get(url, params = {}, headers = {}) {
  const urlParameters = urlEncodeParameters(params);
  return fetch(`${url}${urlParameters ? `?${urlParameters}` : ''}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain', // for Firefox CORS:
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS?redirectlocale=en-US&redirectslug=HTTP_access_control#Simple_requests
      ...headers,
      ...createStatisticsHeaders(),
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  }).then(transformResponse);
}

export function downloadFile(url, headers = {}) {
  return fetch(url, {
    headers: { ...headers, ...createStatisticsHeaders() },
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    cache: 'default',
  }).then(transformFileResponse);
}

export function post(url, params = {}, headers = {}) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
      ...createStatisticsHeaders(),
    },
    body: JSON.stringify(params),
    credentials: 'include',
    mode: 'cors',
    cache: 'default',
  }).then(transformResponse);
}

// TODO: write tests for this
export function put(url, params = {}, headers = {}) {
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
      ...createStatisticsHeaders(),
    },
    body: JSON.stringify(params),
    credentials: 'include',
    mode: 'cors',
    cache: 'default',
  }).then(transformResponse);
}

export function postForm(url, params = {}, headers = {}) {
  const body = urlEncodeParameters(params);
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...headers,
      ...createStatisticsHeaders(),
    },
    body,
    credentials: 'include',
    mode: 'cors',
    cache: 'default',
  }).then(transformResponse);
}
