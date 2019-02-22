import axios, { AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios';

// const baseUrl: string = process.env.VUE_APP_BASE_URL_API || 'http://localhost:5000/';

export const config = { baseUrl: 'http://localhost:5000/' };

function errorHandler(e: any) {
  return e;
}

function getConfig(conf?: AxiosRequestConfig): AxiosRequestConfig {
  conf = conf || {};
  return {
    ...conf,
    headers: {
      'Content-Type': 'application/json',
      ...conf.headers,
    },
  };
}

function handleAxiosResponsePromise(p: AxiosPromise): Promise<AxiosResponse> {
  return p
    .catch((err: any) => errorHandler(err));
}

function handleAxiosPromise<T>(p: AxiosPromise<T>): Promise<T> {
  return p
    .then((res: AxiosResponse<T>) => res.data)
    .catch((err: any) => errorHandler(err));
}

export function getServiceUrl(relativeUrl: string): string {
  if (relativeUrl.startsWith('/')) { relativeUrl = relativeUrl.substr(1); }
  return `${config.baseUrl}${relativeUrl}`;
}

// #region requests
export function request(conf?: AxiosRequestConfig) {
  return requestT<any>(conf);
}

export function requestT<T>(conf?: AxiosRequestConfig): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    axios.request(getConfig(conf))
      .then((res: AxiosResponse<T>) => { resolve(res.data); })
      .catch((err) => { reject(errorHandler(err)); });
  });
}
// #endregion

// #region gets
export function get(relativeUrl: string, conf?: AxiosRequestConfig): Promise<any> {
  return handleAxiosPromise<any>(axios.get(getServiceUrl(relativeUrl), getConfig(conf)));
}

export function getT<T>(relativeUrl: string, conf?: AxiosRequestConfig): Promise<T> {
  return handleAxiosPromise<T>(axios.get(getServiceUrl(relativeUrl), getConfig(conf)));
}
// #endregion

// #region posts
export function post(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<AxiosResponse> {
  return handleAxiosResponsePromise(axios.post(getServiceUrl(relativeUrl), data, getConfig(conf)));
}

export function postT<T>(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<T> {
  return handleAxiosPromise<T>(axios.post(getServiceUrl(relativeUrl), data, getConfig(conf)));
}
// #endregion

// #region puts
export function put(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<AxiosResponse> {
  return handleAxiosResponsePromise(axios.put(getServiceUrl(relativeUrl), data, getConfig(conf)));
}

export function putT<T>(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<T> {
  return handleAxiosPromise<T>(axios.put(getServiceUrl(relativeUrl), data, getConfig(conf)));
}
// #endregion

// #region deletes
export function dele(relativeUrl: string, conf?: AxiosRequestConfig): Promise<AxiosResponse> {
  return handleAxiosResponsePromise(axios.delete(getServiceUrl(relativeUrl), getConfig(conf)));
}

export function deleT<T>(relativeUrl: string, conf?: AxiosRequestConfig): Promise<T> {
  return handleAxiosPromise<T>(axios.delete(getServiceUrl(relativeUrl), getConfig(conf)));
}
// #endregion
