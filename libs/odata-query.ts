import * as _ from 'lodash';
import { ExpandBuilder, ConnectionService, IConnectionService, DefaultConnectionServiceConfig, Parameter } from '.';

export interface IQuery {
  /**
   * set the api version.
   * @param val the api version
   */
  apiVersion(val: string): IQuery;

  /**
   * The 'top' system query option requests the number of items in the queried collection
   * to be included in the result.
   * @param val the top value
   */
  top(val: number): IQuery;

  /**
   * The 'skip' query option requests the number of items in the queried collection that are
   * to be skipped and not included in the result.
   * @param val the skip value
   */
  skip(val: number): IQuery;

  /**
   * The 'filter' system query option allows clients to filter a collection of resources that are
   * addressed by a request URL.
   * @param val the filter statement
   */
  filter(...val: string[]): IQuery;

  /**
   * The 'order by' system query option allows clients to request resources in either ascending order
   * using asc or descending order using desc. If asc or desc not specified, then the resources
   * will be ordered in ascending order.
   * @param val the order by statement
   */
  orderBy(...val: string[]): IQuery;

  /**
   * The 'expand' system query option specifies the related resources to be included in line with retrieved resources.
   * @param val the expand statement
   */
  expand(val: string | ExpandBuilder | ExpandBuilder[]): IQuery;

  /**
   * has expand statement
   */
  hasExpand(): boolean;

  /**
   * The 'select' system query option allows the clients to requests a limited set of properties for each entity
   * @param val the select statement
   */
  select(val: string): IQuery;

  /**
   * all Pages Row Count
   * @param val the value
   */
  allPagesRowCount(val?: boolean): IQuery;

  /**
   * execute the query
   */
  q(): Promise<any>;

  /**
   * execute and get row count
   */
  count(): Promise<any>;

  /**
   * Get by key
   * @param key the key
   */
  getByKey(key: any): Promise<any>;

  /** Clone the query */
  cloneQuery(): IQuery;
  /**
   * group by statement
   * @param groupByString the group by statement string
   */
  groupBy(groupByString: string): IQuery;

  /**
   * apply statement
   * @param applyString the apply statement string
   */
  apply(applyString: string): IQuery;

  /**
   * add parameters to query
   * @param val parameter string array
   */
  parameters(...val: string[]): IQuery;

  /**
   * add single parameter to query
   * @param parameterName the parameter name
   * @param value the parameter value
   */
  parameter(parameterName: string, value: any): IQuery;
}

export function canQuery(arg: any): arg is IQuery {
  return arg.q !== undefined;
}


/**
 *  OData Query type. This type using to prepare odata query.
 */
export class ODataQuery implements IQuery {
  private _resource: string;
  private _queryStrings: string[] = [];
  private _key: any | null = null;
  private _getAllPagesRowCount: boolean = false;
  private _connectionService: IConnectionService;

  /**
   * create a new ODataQuery
   * @param resource the resource name
   * @param connectionService the connection service instance. If it is undefined, constructor use default connection service from connection service 
   */
  constructor(resource: string, connectionService?: IConnectionService) {
    this._resource = resource;
    if (connectionService) {
      this._connectionService = connectionService;
    } else {
      this._connectionService = ConnectionService.DefaultConnectionService;
    }
  }

  /**
   * set the api version.
   * @param val the api version
   */
  public apiVersion(val: string): IQuery {
    this._queryStrings.push('api-version=' + val);
    return this;
  }

  /**
   * The 'top' system query option requests the number of items in the queried collection
   * to be included in the result.
   * @param val the top value
   */
  public top(val: number): IQuery {
    this._queryStrings.push('$top=' + val);
    this._getAllPagesRowCount = true;
    return this;
  }

  /**
   * The 'skip' query option requests the number of items in the queried collection that are
   * to be skipped and not included in the result.
   * @param val the skip value
   */
  public skip(val: number): IQuery {
    if (val !== 0) {
      this._queryStrings.push('$skip=' + val);
      this._getAllPagesRowCount = true;
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
    const fi = this._queryStrings.findIndex((x: string) => x.startsWith('$filter='));
    if (fi >= 0) {
      const nf = `$filter=(${this._queryStrings[fi].substring(8)})and(${af})`;
      this._queryStrings.splice(fi, 1);
      this._queryStrings.push(nf);
    } else {
      this._queryStrings.push('$filter=' + af);
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
    const af = val.map((x: string) => x.split(',').map((y: string) => y.replace(/\./gi, '/').trim()).join(',')).join(',');
    if (_.isEmpty(af)) { return this; }
    const fi = this._queryStrings.findIndex((x: string) => x.startsWith('$orderby='));
    if (fi >= 0) {
      const nf = `${this._queryStrings[fi]},${af}`;
      this._queryStrings.splice(fi, 1);
      this._queryStrings.push(nf);
    } else {
      this._queryStrings.push('$orderby=' + af);
    }
    return this;
  }

  /**
   * The 'expand' system query option specifies the related resources to be included in line with retrieved resources.
   * @param val the expand statement
   */
  public expand(val: string | ExpandBuilder | ExpandBuilder[]): IQuery {
    if (_.isString(val)) {
      this._queryStrings.push('$expand=' + val);
    } else if (!!val && _.isArray(val)) {
      const strArray = val.map((i) => i.toString());
      this._queryStrings.push('$expand=' + strArray.join());
    } else if (!!val && _.isObject(val)) {
      this._queryStrings.push('$expand=' + val.toString());
    }
    return this;
  }

  /**
   * has expand statement
   */
  public hasExpand(): boolean {
    return this._queryStrings.some((x: string) => x.startsWith('$expand='));
  }

  /**
   * The 'select' system query option allows the clients to requests a limited set of properties for each entity
   * @param val the select statement
   */
  public select(val: string): IQuery {
    this._queryStrings.push('$select=' + val);
    return this;
  }

  public allPagesRowCount(val: boolean = true): IQuery {
    this._getAllPagesRowCount = val;
    return this;
  }

  public groupBy(groupByString: string): IQuery {
    if (_.isEmpty(groupByString) || _.isEmpty(groupByString.trim())) { return this; }
    this._queryStrings.push(`$apply=groupby(${groupByString.trim().replace(/\./gi, '/')})`);
    return this;
  }

  public apply(applyString: string): IQuery {
    if (_.isEmpty(applyString) || _.isEmpty(applyString.trim())) { return this; }
    this._queryStrings.push(`$apply=${applyString.replace(/\./gi, '/')}`);
    return this;
  }

  public parameters(...val: string[]): IQuery {
    this._queryStrings.push(...val);
    return this;
  }

  public parameter(parameterName: string, value: any): IQuery {
    this._queryStrings.push(new Parameter(parameterName, value).toString());
    return this;
  }
  /**
   * execute the query
   */
  public q(): Promise<any> {
    const conf = { method: 'get', url: this._connectionService.prepareServiceUrl(this.createRelativeUrl()) };
    return this._connectionService.request(conf);
  }

  /** execute and get row count */
  public count(): Promise<number> {
    const conf = { method: 'get', url: this._connectionService.prepareServiceUrl(this.createRelativeUrl(true)) };
    return this._connectionService.requestT<number>(conf);
  }

  /**
   * Get by key
   * @param key the key
   */
  public getByKey(key: any): Promise<any> {
    this._key = key;
    const conf = { method: 'get', url: this._connectionService.prepareServiceUrl(this.createRelativeUrl()) };
    return this._connectionService.request(conf);
  }

  public cloneQuery(): IQuery {
    const q = new ODataQuery(this._resource, this._connectionService);
    q._queryStrings = [...this._queryStrings];
    q._key = this._key;
    q._getAllPagesRowCount = this._getAllPagesRowCount;
    return q;
  }

  private createRelativeUrl(count: boolean = false): any {
    let url = DefaultConnectionServiceConfig.odataEndpoint + '/' + this._resource;

    if (this._key) {
      url += `(${this._key})`;
    }

    if (count) {
      url += '/$count';
    }

    let qs: string[] = [];
    if (this._queryStrings.length > 0) {
      qs = [...this._queryStrings];
    }

    if (this._getAllPagesRowCount) {
      qs.push('$count=true');
    }

    if (qs.length > 0) {
      url += '?' + qs.join('&');
    }
    // debugConsole.log(url);
    return url;
  }
}
