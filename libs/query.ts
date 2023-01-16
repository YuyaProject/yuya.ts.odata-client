import { ExpandBuilder } from '.';
import HttpResponse from './http-response';
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
  q(): Promise<HttpResponse<any>>;
  /**
   * execute and get row count
   */
  count(): Promise<HttpResponse<number>>;
  /**
   * Get by key
   * @param key the key
   */
  getByKey(key: any): Promise<HttpResponse<any>>;
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
