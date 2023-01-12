import axios, { AxiosRequestConfig, AxiosResponse, AxiosPromise, RawAxiosRequestHeaders } from 'axios';
import HttpResponse from './http-response'

// const baseUrl: string = process.env.VUE_APP_BASE_URL_API || 'http://localhost:5000/';

export interface IConnetionSettings {
  baseUrl: string;
  odataEndpoint: string;
}

/** Connection Service default configuration settings */
export const config: IConnetionSettings = {
  baseUrl: 'http://localhost:5000/',
  odataEndpoint: 'odata',
};

/** Connection Service Interface */
export interface IConnectionService {

  /**
   * Prepare the request configuration
   * @param conf the request configuration
   * @returns the full axios request config
   */
  prepareRequestConfig(conf?: AxiosRequestConfig): AxiosRequestConfig;

  /**
   * Prepare the full service url from relative url
   * @param relativeUrl the relative url
   * @returns the full service url
   */
  prepareServiceUrl(relativeUrl: string): string;

  // #region requests
  /**
   * Make request the service
   * @param conf the optional request configurations
   * @returns the promise for service response
   */
  request(conf?: AxiosRequestConfig): Promise<any>;

  /**
   * Make request the service and receive response with T type
   * @param conf the optional request configurations
   * @returns the promise for service response with T response type
   */
  requestT<T>(conf?: AxiosRequestConfig): Promise<HttpResponse<T>>;
  // #endregion

  // #region gets
  /**
   * Make GET request the service
   * @param relativeUrl the relative service url
   * @param conf the optional request configurations
   * @returns the promise for service response
   */
  get(relativeUrl: string, conf?: AxiosRequestConfig): Promise<any>;

  /**
   * Make GET request the service and receive response with T type
   * @param relativeUrl the relative service url
   * @param conf the optional request configurations
   * @returns the promise for service response with T response type
   */
  getT<T>(relativeUrl: string, conf?: AxiosRequestConfig): Promise<HttpResponse<T>>;
  // #endregion

  // #region posts
  /**
   * Make POST request the service
   * @param relativeUrl the relative service url
   * @param data the send data for post operation
   * @param conf the optional request configurations
   * @returns the promise for service response
   */
  post(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<AxiosResponse>;

  /**
   * Make POST request the service and receive response with T type
   * @param relativeUrl the relative service url
   * @param data the send data for post operation
   * @param conf the optional request configurations
   * @returns the promise for service response with T response type
   */
  postT<T>(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<HttpResponse<T>>;
  // #endregion

  // #region puts
  /**
   * Make PUT request the service
   * @param relativeUrl the relative service url
   * @param data the send data for post operation
   * @param conf the optional request configurations
   * @returns the promise for service response
   */
  put(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<AxiosResponse>;

  /**
   * Make PUT request the service and receive response with T type
   * @param relativeUrl the relative service url
   * @param data the send data for post operation
   * @param conf the optional request configurations
   * @returns the promise for service response with T response type
   */
  putT<T>(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<HttpResponse<T>>;
  // #endregion

  // #region patchs
  /**
   * Make PUT request the service
   * @param relativeUrl the relative service url
   * @param data the send data for post operation
   * @param conf the optional request configurations
   * @returns the promise for service response
   */
  patch(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<AxiosResponse>;

  /**
   * Make PUT request the service and receive response with T type
   * @param relativeUrl the relative service url
   * @param data the send data for post operation
   * @param conf the optional request configurations
   * @returns the promise for service response with T response type
   */
  patchT<T>(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<HttpResponse<T>>;
  // #endregion

  // #region deletes
  /**
   * Make DELETE request the service
   * @param relativeUrl the relative service url
   * @param conf the optional request configurations
   * @returns the promise for service response
   */
  dele(relativeUrl: string, conf?: AxiosRequestConfig): Promise<AxiosResponse>;

  /**
   * Make DELETE request the service and receive response with T type
   * @param relativeUrl the relative service url
   * @param conf the optional request configurations
   * @returns the promise for service response with T response type
   */
  deleT<T>(relativeUrl: string, conf?: AxiosRequestConfig): Promise<HttpResponse<T>>;
  // #endregion
}

/** Connection Service Class */
export class ConnectionService implements IConnectionService {

  /** The default static connection service instance */
  private static readonly _defaultConnectionService: IConnectionService = new ConnectionService();
  private _config: IConnetionSettings;

  /**
   * Create a new connection service.
   * @param configuration If this value is not undefined, connection service use this configuration,
   *    otherwise connection service use default connection configuration.
   */
  constructor(configuration?: IConnetionSettings) {
    this._config = (!!configuration) ? configuration : config;
  }

  /** The Default Connection Service instance */
  public static get DefaultConnectionService(): IConnectionService {
    return this._defaultConnectionService;
  }

  public get connetionSettings(): IConnetionSettings {
    return this._config;
  }

  /**
   * Prepare the request configuration
   * @param conf the request configuration
   * @returns the full axios request config
   */
  public prepareRequestConfig(conf?: AxiosRequestConfig): AxiosRequestConfig {
    conf = conf || {};
    return {
      ...conf,
      headers: {
        'Content-Type': 'application/json',
        ...conf.headers,
      } as RawAxiosRequestHeaders,
    };
  }

  /**
   * Prepare the full service url from relative url
   * @param relativeUrl the relative url
   * @returns the full service url
   */
  public prepareServiceUrl(relativeUrl: string): string {
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) return relativeUrl;
    if (relativeUrl.startsWith('/')) { relativeUrl = relativeUrl.substr(1); }
    return `${this._config.baseUrl}${relativeUrl}`;
  }

  // #region requests
  /**
   * Make request the service
   * @param conf the optional request configurations
   * @returns the promise for service response
   */
  public request(conf?: AxiosRequestConfig): Promise<any> {
    return this.requestT<any>(conf);
  }

  /**
   * Make request the service and receive response with T type
   * @param conf the optional request configurations
   * @returns the promise for service response with T response type
   */
  public requestT<T>(conf?: AxiosRequestConfig): Promise<HttpResponse<T>> {
    return new Promise<HttpResponse<T>>((resolve, reject) => {
      axios.request(this.prepareRequestConfig(conf))
        .then((res: AxiosResponse<T>) => { resolve( { data: res.data, headers: res.headers }); })
        .catch((err: any) => { reject(this.errorHandler(err)); });
    });
  }
  // #endregion

  // #region gets
  // #region gets
  /**
   * Make GET request the service
   * @param relativeUrl the relative service url
   * @param conf the optional request configurations
   * @returns the promise for service response
   */
  public get(relativeUrl: string, conf?: AxiosRequestConfig): Promise<any> {
    return this.handleAxiosPromise<any>(
      axios.get(this.prepareServiceUrl(relativeUrl), this.prepareRequestConfig(conf)));
  }

  /**
   * Make GET request the service and receive response with T type
   * @param relativeUrl the relative service url
   * @param conf the optional request configurations
   * @returns the promise for service response with T response type
   */
  public getT<T>(relativeUrl: string, conf?: AxiosRequestConfig): Promise<HttpResponse<T>> {
    return this.handleAxiosPromise<T>(
      axios.get(this.prepareServiceUrl(relativeUrl), this.prepareRequestConfig(conf)));
  }
  // #endregion

  // #region posts
  /**
   * Make POST request the service
   * @param relativeUrl the relative service url
   * @param data the send data for post operation
   * @param conf the optional request configurations
   * @returns the promise for service response
   */
  public post(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.handleAxiosResponsePromise(
      axios.post(this.prepareServiceUrl(relativeUrl), data, this.prepareRequestConfig(conf)));
  }

  /**
   * Make POST request the service and receive response with T type
   * @param relativeUrl the relative service url
   * @param data the send data for post operation
   * @param conf the optional request configurations
   * @returns the promise for service response with T response type
   */
  public postT<T>(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<HttpResponse<T>> {
    return this.handleAxiosPromise<T>(
      axios.post(this.prepareServiceUrl(relativeUrl), data, this.prepareRequestConfig(conf)));
  }
  // #endregion

  // #region puts
  /**
   * Make PUT request the service
   * @param relativeUrl the relative service url
   * @param data the send data for post operation
   * @param conf the optional request configurations
   * @returns the promise for service response
   */
  public put(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.handleAxiosResponsePromise(
      axios.put(this.prepareServiceUrl(relativeUrl), data, this.prepareRequestConfig(conf)));
  }

  /**
   * Make PUT request the service and receive response with T type
   * @param relativeUrl the relative service url
   * @param data the send data for post operation
   * @param conf the optional request configurations
   * @returns the promise for service response with T response type
   */
  public putT<T>(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<HttpResponse<T>> {
    return this.handleAxiosPromise<T>(axios.put(
      this.prepareServiceUrl(relativeUrl), data, this.prepareRequestConfig(conf)));
  }
  // #endregion



  // #region patchs
  /**
   * Make PUT request the service
   * @param relativeUrl the relative service url
   * @param data the send data for post operation
   * @param conf the optional request configurations
   * @returns the promise for service response
   */
  public patch(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.handleAxiosResponsePromise(
      axios.patch(this.prepareServiceUrl(relativeUrl), data, this.prepareRequestConfig(conf)));
  }

  /**
   * Make PUT request the service and receive response with T type
   * @param relativeUrl the relative service url
   * @param data the send data for post operation
   * @param conf the optional request configurations
   * @returns the promise for service response with T response type
   */
  public patchT<T>(relativeUrl: string, data: any, conf?: AxiosRequestConfig): Promise<HttpResponse<T>> {
    return this.handleAxiosPromise<T>(axios.patch(
      this.prepareServiceUrl(relativeUrl), data, this.prepareRequestConfig(conf)));
  }
  // #endregion

  // #region deletes
  /**
   * Make DELETE request the service
   * @param relativeUrl the relative service url
   * @param conf the optional request configurations
   * @returns the promise for service response
   */
  public dele(relativeUrl: string, conf?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.handleAxiosResponsePromise(
      axios.delete(this.prepareServiceUrl(relativeUrl), this.prepareRequestConfig(conf)));
  }

  /**
   * Make DELETE request the service and receive response with T type
   * @param relativeUrl the relative service url
   * @param conf the optional request configurations
   * @returns the promise for service response with T response type
   */
  public deleT<T>(relativeUrl: string, conf?: AxiosRequestConfig): Promise<HttpResponse<T>> {
    return this.handleAxiosPromise<T>(
      axios.delete(this.prepareServiceUrl(relativeUrl), this.prepareRequestConfig(conf)));
  }
  // #endregion

  private errorHandler(e: any) {
    return e;
  }

  private async handleAxiosResponsePromise(p: AxiosPromise): Promise<AxiosResponse> {
    try {
      return p;
    } catch (err) {
      throw this.errorHandler(err);
    }
  }

  private async handleAxiosPromise<T>(p: AxiosPromise<T>): Promise<HttpResponse<T>> {
    try {
      const res = await p;
      return  { data: res.data, headers: res.headers };
    } catch (err) {
      throw this.errorHandler(err);
    }
  }
}
