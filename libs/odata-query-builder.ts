import { ExpandBuilder } from './expand-builder';
import { ODataQuery } from './odata-query';
import _ from 'lodash';

export enum OrderByDirection { Asc, Desc }

export class ODataQueryBuilder {
  // tslint:disable-next-line:variable-name
  private _resource: string;
  // private queryStrings: string[] = [];
  // private key: any | null = null;
  // tslint:disable-next-line:variable-name
  private _getAllPagesRowCount: boolean = false;
  // tslint:disable-next-line:variable-name
  private _columns: string[] = [];
  // tslint:disable-next-line:variable-name
  private _expands: _.Dictionary<ExpandBuilder> = {};
  // tslint:disable-next-line:variable-name
  private _filters: string[] = [];
  // tslint:disable-next-line:variable-name
  private _orderByList: string[] = [];
  // tslint:disable-next-line:variable-name
  private _apiVersion: string | null = null;
  // tslint:disable-next-line:variable-name
  private _top: number = 0;
  // tslint:disable-next-line:variable-name
  private _skip: number = 0;

  constructor(resource: string) {
    this._resource = resource;
  }

  /**
   * set the api version.
   * @param val the api version
   */
  public apiVersion(val: string | null): ODataQueryBuilder {
    this._apiVersion = val;
    return this;
  }

  public addColumn(columnName: string) {
    if (!_.isString(columnName) || _.isEmpty(columnName)) { return this; }
    for (const cn of columnName.split(',').map((x: string) => x.trim())) {
      if (!_.isEmpty(cn) && !_.some(this._columns, cn)) {
        this._columns.push(cn);
      }
    }
    return this;
  }

  public addColumns(...columnNames: string[]): ODataQueryBuilder;
  public addColumns(columnNames: string): ODataQueryBuilder;

  public addColumns(...columnNames: string[]): ODataQueryBuilder {
    if (!_.isArray(columnNames) || _.isEmpty(columnNames)) { return this; }
    for (const cn of columnNames.map((x: string) => x.trim())) {
      this.addColumn(cn);
    }
    return this;
  }

  public removeColumns(...columnNames: string[]): ODataQueryBuilder {
    if (!columnNames || !columnNames.length) { return this; }
    for (const cn of columnNames) {
      const index = this._columns.indexOf(cn);
      if (index >= 0) {
        this._columns.splice(index, 1);
      }
    }
    return this;
  }

  public clearColumns(): ODataQueryBuilder {
    this._columns = [];
    return this;
  }

  public addExpandColumns(...columnNames: string[]): ODataQueryBuilder {
    if (!columnNames || !columnNames.length) { return this; }
    for (const cn of columnNames) {
      const split = cn.split('.');
      if (split.length === 1) {
        this.addColumns(cn);
      } else if (split.length > 1) {
        let exp: ExpandBuilder;
        if (Object.keys(this._expands).indexOf(split[0]) < 0) {
          exp = new ExpandBuilder(split[0]);
          this._expands[split[0]] = exp;
        } else {
          exp = this._expands[split[0]];
        }
        exp.addExpandFromString(cn);
      }
    }
    return this;
  }

  public addFilters(filters: string[]): ODataQueryBuilder {
    if (!filters || !filters.length) { return this; }
    this._filters.push(...filters);
    return this;
  }

  public clearFilters() {
    this._filters = [];
    return this;
  }

  public addOrderBy(column: string, direction: OrderByDirection = OrderByDirection.Asc): ODataQueryBuilder {
    this._orderByList.push(column + (direction === OrderByDirection.Asc ? ' asc' : ' desc'));
    return this;
  }

  public addOrderByDesc(column: string): ODataQueryBuilder {
    this._orderByList.push(column + ' desc');
    return this;
  }

  public addOrderByList(columns: string | string[]) {
    if (_.isArray(columns)) {
      this._orderByList.push(...columns);
    } else if (_.isString(columns)) {
      this._orderByList.push(...(columns.split(',')));
    }
    return this;
  }

  public clearOrderByList(): ODataQueryBuilder {
    this._orderByList = [];
    return this;
  }

  public top(value: number): ODataQueryBuilder {
    this._top = value;
    return this;
  }

  public skip(value: number): ODataQueryBuilder {
    this._skip = value;
    return this;
  }

  public getQuery(): ODataQuery {
    const q = new ODataQuery(this._resource);

    if (Object.keys(this._expands).length > 0) {
      q.expand(Object.keys(this._expands).map((x: string) => this._expands[x]));
    }

    if (!_.isEmpty(this._columns)) {
      q.select(this._columns.join(','));
    }

    if (this._filters.length > 0) {
      q.filter(...this._filters);
    }

    if (_.isString(this._apiVersion) && !_.isEmpty(this._apiVersion)) {
      q.apiVersion(this._apiVersion);
    }

    if (this._top > 0) {
      q.top(this._top);
    }

    if (this._skip > 0) {
      q.skip(this._skip);
    }

    if (this._getAllPagesRowCount) {
      q.allPagesRowCount(true);
    }
    return q;
  }

  public q(): Promise<any> {
    return this.getQuery().q();
  }
}
