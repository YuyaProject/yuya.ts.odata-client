import * as _ from 'lodash';
import {
  IQuery, ExpandBuilder, ConnectionService, IConnectionService,
  DefaultConnectionServiceConfig, Parameter,
} from '.';
import { IMutationResult, getMutationResult, MutationErrorResult } from './mutation';
import { AxiosRequestConfig } from 'axios';

export function canQuery(arg: any): arg is IQuery {
  return arg.q !== undefined;
}

/**
 *  OData Query type. This type using to prepare odata query.
 */
export class ODataQuery implements IQuery {
  private queryStrings: string[] = [];
  private key: any | null = null;
  private getAllPagesRowCount: boolean = false;

  /**
   * create a new ODataQuery
   * @param resource the resource name
   * @param connectionService the connection service instance. If it is undefined,
   *    constructor use default connection service from connection service
   * @param additionalQueryStrings if we send additional query string on the request,
   *    we add it in this collection.
   */
  constructor(
    public readonly resource: string,
    public readonly connectionService: IConnectionService = ConnectionService.DefaultConnectionService,
    public readonly aditionalQueryStrings: Record<string, string> = {},
  ) {
  }

  // #region Preparetion
  /**
   * set the api version.
   * @param val the api version
   */
  public apiVersion(val: string): IQuery {
    this.queryStrings.push('api-version=' + val);
    return this;
  }

  /**
   * The 'top' system query option requests the number of items in the queried collection
   * to be included in the result.
   * @param val the top value
   */
  public top(val: number): IQuery {
    this.queryStrings.push('$top=' + val);
    this.getAllPagesRowCount = true;
    return this;
  }

  /**
   * The 'skip' query option requests the number of items in the queried collection that are
   * to be skipped and not included in the result.
   * @param val the skip value
   */
  public skip(val: number): IQuery {
    if (val !== 0) {
      this.queryStrings.push('$skip=' + val);
      this.getAllPagesRowCount = true;
    }
    return this;
  }

  /**
   * The 'filter' system query option allows clients to filter a collection of resources that are
   * addressed by a request URL.
   * @param val the filter statement
   */
  public filter(...val: string[]): IQuery {
    const af = val.map((x: string) => x.trim()).filter((x: string) => !_.isEmpty(x)).join(' and ');
    if (_.isEmpty(af)) { return this; }
    const fi = this.queryStrings.findIndex((x: string) => x.startsWith('$filter='));
    if (fi >= 0) {
      const nf = `$filter=(${this.queryStrings[fi].substring(8)})and(${af})`;
      this.queryStrings.splice(fi, 1);
      this.queryStrings.push(nf);
    } else {
      this.queryStrings.push('$filter=' + af);
    }
    return this;
  }

  /**
   * The 'order by' system query option allows clients to request resources in either ascending order
   * using asc or descending order using desc. If asc or desc not specified, then the resources
   * will be ordered in ascending order.
   * @param val the order by statement
   */
  public orderBy(...val: string[]): IQuery {
    const af = val
      .map((x: string) => x.split(',').map((y: string) => y.replace(/\./gi, '/').trim()).join(',')).join(',');
    if (_.isEmpty(af)) { return this; }
    const fi = this.queryStrings.findIndex((x: string) => x.startsWith('$orderby='));
    if (fi >= 0) {
      const nf = `${this.queryStrings[fi]},${af}`;
      this.queryStrings.splice(fi, 1);
      this.queryStrings.push(nf);
    } else {
      this.queryStrings.push('$orderby=' + af);
    }
    return this;
  }

  /**
   * The 'expand' system query option specifies the related resources to be included in line with retrieved resources.
   * @param val the expand statement
   */
  public expand(val: string | ExpandBuilder | ExpandBuilder[]): IQuery {
    if (_.isString(val)) {
      this.queryStrings.push('$expand=' + val);
    } else if (!!val && _.isArray(val)) {
      const strArray = val.map((i) => i.toString());
      this.queryStrings.push('$expand=' + strArray.join());
    } else if (!!val && _.isObject(val)) {
      this.queryStrings.push('$expand=' + val.toString());
    }
    return this;
  }

  /**
   * has expand statement
   */
  public hasExpand(): boolean {
    return this.queryStrings.some((x: string) => x.startsWith('$expand='));
  }

  /**
   * The 'select' system query option allows the clients to requests a limited set of properties for each entity
   * @param val the select statement
   */
  public select(val: string): IQuery {
    this.queryStrings.push('$select=' + val);
    return this;
  }

  public allPagesRowCount(val: boolean = true): IQuery {
    this.getAllPagesRowCount = val;
    return this;
  }

  public groupBy(groupByString: string): IQuery {
    if (_.isEmpty(groupByString) || _.isEmpty(groupByString.trim())) { return this; }
    this.queryStrings.push(`$apply=groupby(${groupByString.trim().replace(/\./gi, '/')})`);
    return this;
  }

  public apply(applyString: string): IQuery {
    if (_.isEmpty(applyString) || _.isEmpty(applyString.trim())) { return this; }
    this.queryStrings.push(`$apply=${applyString.replace(/\./gi, '/')}`);
    return this;
  }

  public parameters(...val: string[]): IQuery {
    this.queryStrings.push(...val);
    return this;
  }

  public parameter(parameterName: string, value: any): IQuery {
    this.queryStrings.push(new Parameter(parameterName, value).toString());
    return this;
  }
  // #endregion

  // #region execution
  /**
   * execute the query
   */
  public q(): Promise<any> {
    const conf = { method: 'get', url: this.connectionService.prepareServiceUrl(this.createRelativeUrl()) };
    return this.connectionService.request(conf);
  }

  /** execute and get row count */
  public count(): Promise<number> {
    const conf = { method: 'get', url: this.connectionService.prepareServiceUrl(this.createRelativeUrl(true)) };
    return this.connectionService.requestT<number>(conf);
  }

  /**
   * Get by key
   * @param key the key
   */
  public getByKey(key: any): Promise<any> {
    this.key = key;
    const conf = { method: 'get', url: this.connectionService.prepareServiceUrl(this.createRelativeUrl()) };
    return this.connectionService.request(conf);
  }

  // #region Mutations
  public post<TEntity = any>(entity: any, conf?: AxiosRequestConfig): Promise<IMutationResult<TEntity>> {
    const url = this.createRelativeUrl();
    return new Promise<IMutationResult<TEntity>>((resolve, reject) => {
      this.connectionService
        .post(url, entity, conf)
        .then((x) => resolve(getMutationResult<TEntity>(x)))
        .catch((x) => reject(new MutationErrorResult(x)));
    });
  }

  public put<TEntity = any>(key: any, entity: any, conf?: AxiosRequestConfig): Promise<IMutationResult<TEntity>> {
    this.key = key;
    const url = this.createRelativeUrl();
    return new Promise<IMutationResult<TEntity>>((resolve, reject) => {
      this.connectionService
        .put(url, entity, conf)
        .then((x) => resolve(getMutationResult<TEntity>(x)))
        .catch((x) => reject(new MutationErrorResult(x)));
    });
  }

  public patch<TEntity = any>(key: any, entity: any, conf?: AxiosRequestConfig): Promise<IMutationResult<TEntity>> {
    this.key = key;
    const url = this.createRelativeUrl();
    return new Promise<IMutationResult<TEntity>>((resolve, reject) => {
      this.connectionService
        .patch(url, entity, conf)
        .then((x) => resolve(getMutationResult<TEntity>(x)))
        .catch((x) => reject(new MutationErrorResult(x)));
    });
  }

  public delete<TEntity = any>(key: any, conf?: AxiosRequestConfig): Promise<IMutationResult<TEntity>> {
    this.key = key;
    const url = this.createRelativeUrl();
    return new Promise<IMutationResult<TEntity>>((resolve, reject) => {
      this.connectionService
        .dele(url, conf)
        .then((x) => resolve(getMutationResult<TEntity>(x)))
        .catch((x) => reject(new MutationErrorResult(x)));
    });
  }
  // #endregion
  // #endregion

  // #region utility
  /** clone the query */
  public cloneQuery(): IQuery {
    const q = new ODataQuery(this.resource, this.connectionService);
    q.queryStrings = [...this.queryStrings];
    q.key = this.key;
    q.getAllPagesRowCount = this.getAllPagesRowCount;
    return q;
  }

  private createRelativeUrl(count: boolean = false): any {
    let url = DefaultConnectionServiceConfig.odataEndpoint + '/' + this.resource;

    if (!!this.key) {
      url += `(${this.key})`;
    }

    if (count) {
      url += '/$count';
    }

    let qs: string[] = [];
    if (this.queryStrings.length > 0) {
      qs = [...this.queryStrings];
    }

    if (this.getAllPagesRowCount) {
      qs.push('$count=true');
    }

    for (const k of Object.keys(this.aditionalQueryStrings)) {
      const aqs = this.aditionalQueryStrings[k];
      qs.push(`${k}=${aqs}`);
    }

    if (qs.length > 0) {
      url += '?' + qs.join('&');
    }
    // debugConsole.log(url);
    return url;
  }
  // #endregion
}
