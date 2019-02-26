import { ExpandBuilder } from './expand-builder';
import { ODataQuery } from './odata-query';
import _ from 'lodash';
import { isExpression, Expression } from '.';
import { OData } from '.';
import { Parameter, isParameter } from './parameter';

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
  private _filters: any[] = [];
  // tslint:disable-next-line:variable-name
  private _orderByList: string[] = [];
  // tslint:disable-next-line:variable-name
  private _apiVersion: string | null = null;
  // tslint:disable-next-line:variable-name
  private _top: number = 0;
  // tslint:disable-next-line:variable-name
  private _skip: number = 0;
  // tslint:disable-next-line:variable-name
  private _parameters: _.Dictionary<Parameter> = {};

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

  public addFilters(...filters: (string | Expression)[]): ODataQueryBuilder {
    if (!filters || !filters.length) { return this; }
    for (const c of filters.filter((x) => x !== null)) {
      if (_.isString(c) && !_.isEmpty(c)) {
        this._filters.push(c);
      } else if (isExpression(c) && !_.isEmpty(c.text)) {
        this._filters.push(c);
      }
    }
    return this;
  }

  public clearFilters() {
    this._filters = [];
    return this;
  }

  public addOrderBy(column: string, direction: OrderByDirection = OrderByDirection.Asc): ODataQueryBuilder {
    const c = column.trim();
    if (!_.isEmpty(c)) {
      this._orderByList.push(c + (direction === OrderByDirection.Asc ? '' : ' desc'));
    }
    return this;
  }

  public addOrderByDesc(column: string): ODataQueryBuilder {
    const c = column.trim();
    if (!_.isEmpty(c)) {
      this._orderByList.push(c + ' desc');
    }
    return this;
  }

  public addOrderByList(...columns: string[]) {
    if (_.isArray(columns) && !_.isEmpty(columns)) {
      for (const c of columns) {
        if ((c !== undefined && c !== null) && !_.isEmpty(c.trim())) {
          const cols = c.split(',')
            .map((x: string) => (x || '').trim())
            .filter((x: string) => !_.isEmpty(x));
          this._orderByList.push(...cols);
        }
      }
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

  public addParameter(parameterName: string, value: any): ODataQueryBuilder;
  public addParameter(parameter: Parameter): ODataQueryBuilder;

  public addParameter(parameterName: string | Parameter, value?: any): ODataQueryBuilder {
    if (_.isString(parameterName)) {
      const p = new Parameter(parameterName, value);
      this._parameters[p.parameterName] = p;
    } else if (isParameter(parameterName)) {
      this._parameters[parameterName.parameterName] = parameterName;
    }
    return this;
  }

  public addParameters(parameter: Parameter): ODataQueryBuilder;
  public addParameters(parameterList: Parameter[]): ODataQueryBuilder;
  public addParameters(parameters: _.Dictionary<Parameter>): ODataQueryBuilder;

  public addParameters(parameters: _.Dictionary<Parameter> | Parameter[] | Parameter): ODataQueryBuilder {
    if (_.isArray(parameters)) {
      for (const p of parameters) {
        this._parameters[p.name] = p;
      }
    } else if (isParameter(parameters)) {
      this._parameters[parameters.name] = parameters;
    } else if (_.isObject(parameters)) {
      this._parameters = {
        ...this._parameters,
        ...parameters
      };
    }
    return this;
  }

  public removeParameter(parameterName: string) {
    if (Object.keys(this._parameters).some((x) => x === parameterName)) {
      delete this._parameters[parameterName];
    }
    return this;
  }

  public clearParameters(): ODataQueryBuilder {
    this._parameters = {};
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
      const filters = this._filters
        .filter((x: any) => _.isString(x))
        .map((x: any) => x as string);
      const f2 = this._filters
        .filter((x: any) => isExpression(x) && !_.isEmpty(x.text))
        .map((x: Expression) => x.text);

      if (f2.length > 0) { filters.push(...f2); }

      q.filter(...filters);
    }
    if (this._orderByList.length > 0) {
      const orderByList = this._orderByList.filter((x: string) => !_.isEmpty(x.trim()));
      if (orderByList.length > 0) {
        q.orderBy(...orderByList);
      }
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

    var parameters = Object.keys(this._parameters);
    if (parameters.length > 0) {
      q.parameters(...parameters.map((x) => this._parameters[x].toString()));
    }

    return q;
  }

  public q(): Promise<any> {
    return this.getQuery().q();
  }
}
