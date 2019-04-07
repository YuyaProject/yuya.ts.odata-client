import _ from 'lodash';
import { isExpression, Expression, Parameter, isParameter,  ODataQuery, OData } from '.';
import { ColumnBuilder, GroupByBuilder, ExpandBuilder, ExpandQueryBuilder } from './query-builders';
import { ExpandQuerydBuilder } from './query-builders/expand-query-builder';

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
  private _columnBuilder: ColumnBuilder | null = null;
  // tslint:disable-next-line:variable-name
  private _expandBuilder: ExpandQueryBuilder | null = null;
  // tslint:disable-next-line:variable-name
  private _groupByBuilder: GroupByBuilder | null = null;
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
   * gets the filter string
   * @returns the filter string
   */
  public get filterString(): string {
    return OData.prepareFilterString(this._filters);
  }

  /**
   * set the api version.
   * @param val the api version
   */
  public apiVersion(val: string | null): ODataQueryBuilder {
    this._apiVersion = val;
    return this;
  }

  /**
   * get total row count with response
   * @param val the value
   */
  public allPagesRowCount(val: boolean = true): ODataQueryBuilder {
    this._getAllPagesRowCount = val;
    return this;
  }

  // #region columns


  public get columns(): ColumnBuilder {
    if (this._columnBuilder === null) {
      this._columnBuilder = new ColumnBuilder(this);
    }
    return this._columnBuilder;
  }


  // #endregion

  // #region expand


  public get expands(): ExpandQuerydBuilder {
    if (this._expandBuilder === null) {
      this._expandBuilder = new ExpandQuerydBuilder(this);
    }
    return this._expandBuilder;
  }

  // #endregion

  // #region filter
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
  // #endregion

  // #region order by
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
  // #endregion

  public top(value: number): ODataQueryBuilder {
    this._top = value;
    return this;
  }

  public skip(value: number): ODataQueryBuilder {
    this._skip = value;
    return this;
  }

  // #region Parameters
  public addParameter(parameterName: string, value: any): ODataQueryBuilder;
  public addParameter(parameter: Parameter): ODataQueryBuilder;

  public addParameter(parameterName: string | Parameter, value?: any): ODataQueryBuilder {
    if (_.isString(parameterName)) {
      const p = new Parameter(parameterName as string, value);
      this._parameters[p.parameterName] = p;
    } else { // if (isParameter(parameterName))  sadece bu durum kalıyor. 
      this._parameters[(parameterName as Parameter).parameterName] = parameterName;
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
    } else { // if (_.isObject(parameters))  sadece bu durum kalıyor. 
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
  // #endregion

  // #region Group By

  public get groupBy(): GroupByBuilder {
    if (this._groupByBuilder === null) {
      this._groupByBuilder = new GroupByBuilder(this);
    }
    return this._groupByBuilder;
  }

  // #endregion

  public getQuery(): ODataQuery {
    const q = new ODataQuery(this._resource);

    if (Object.keys(this._expands).length > 0) {
      q.expand(Object.keys(this._expands).map((x: string) => this._expands[x]));
    }

    if (!_.isEmpty(this._columns)) {
      q.select(this._columns.join(','));
    }

    if (this._groupByBuilder !== null && !this._groupByBuilder.isEmpty) {
      q.apply(this._groupByBuilder.toString());
      var havingString = this._groupByBuilder.havingString;
      if (!_.isEmpty(havingString)) {
        q.filter(havingString);
      }
    }
    else {
      var filters = OData.prepareFilterString(this._filters);
      if (!_.isEmpty(filters)) { q.filter(filters); }
    }

    if (this._orderByList.length > 0) {
      const orderByList = this._orderByList.filter((x: string) => !_.isEmpty(x.trim()));
      // buradaki if'i this._orderByList içinde boş string olmamasını garantili hale getirmiş olduğum için sildim. 
      q.orderBy(...orderByList);
    }

    if (this._apiVersion !== null && _.isString(this._apiVersion) && !_.isEmpty(this._apiVersion)) {
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
