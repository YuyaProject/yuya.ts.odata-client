import * as _ from 'lodash';
import { getServiceUrl, request, requestT } from './default-connection-service';
import { ExpandBuilder } from '.';

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

  groupBy(gbs: string): IQuery;
}

export function canQuery(arg: any): arg is IQuery {
  return arg.q !== undefined;
}


/**
 *  OData Query type. This type using to prepare odata query.
 */
export class ODataQuery implements IQuery {
  private resource: string;
  private queryStrings: string[] = [];
  private key: any | null = null;
  private getAllPagesRowCount: boolean = false;
  constructor(resource: string) {
    this.resource = resource;
  }

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
    const fi = this.queryStrings.findIndex((x: string) => x.startsWith('$filter='));
    const af = '(' + val.join(') and (') + ')';
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
    const fi = this.queryStrings.findIndex((x: string) => x.startsWith('$orderby='));
    const af = val.map((x: string) => x.replace(/\./gi, '/')).join(',');
    if (fi >= 0) {
      const nf = `$orderby=${af}`;
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

  public groupBy(gbs: string): IQuery {
    this.queryStrings.push(`$apply=groupby(${gbs.replace(/\./gi, '/')})`);
    return this;
  }

  /**
   * execute the query
   */
  public q(): Promise<any> {
    const conf = { method: 'get', url: getServiceUrl(this.createRelativeUrl()) };
    return request(conf);
  }

  /** execute and get row count */
  public count(): Promise<number> {
    const conf = { method: 'get', url: getServiceUrl(this.createRelativeUrl(true)) };
    return requestT<number>(conf);
  }

  /**
   * Get by key
   * @param key the key
   */
  public getByKey(key: any): Promise<any> {
    this.key = key;
    const conf = { method: 'get', url: getServiceUrl(this.createRelativeUrl()) };
    return request(conf);
  }

  public cloneQuery(): IQuery {
    const q = new ODataQuery(this.resource);
    q.queryStrings = [...this.queryStrings];
    q.key = this.key;
    return q;
  }

  private createRelativeUrl(count: boolean = false): any {
    let url = 'odata/' + this.resource;

    if (this.key) {
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

    if (qs.length > 0) {
      url += '?' + qs.join('&');
    }
    // debugConsole.log(url);
    return url;
  }
}
