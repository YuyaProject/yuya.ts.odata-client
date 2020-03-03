import _ from 'lodash';
import {
  isExpression, Expression, Parameter, isParameter, GroupByBuilder, ExpandBuilder, ODataQuery,
  IConnectionService, ConnectionService,
} from '.';

export enum OrderByDirection { Asc, Desc }

export class ODataQueryBuilder {
  private getAllPagesRowCount: boolean = false;
  private columns: string[] = [];
  private expands: _.Dictionary<ExpandBuilder> = {};
  private filters: any[] = [];
  private groupByBuilder: GroupByBuilder | null = null;
  private orderByList: string[] = [];
  private apiVersion: string | null = null;
  private top: number = 0;
  private skip: number = 0;
  private parameters: _.Dictionary<Parameter> = {};

  constructor(
    public readonly resource: string,
    public readonly connectionService: IConnectionService = ConnectionService.DefaultConnectionService,
    public readonly additionalQueryStrings: Record<string, string> = {},
  ) {
  }

  public clone(): ODataQueryBuilder {
    const n = new ODataQueryBuilder(this.resource);
    n.getAllPagesRowCount = this.getAllPagesRowCount;
    n.columns = [...this.columns];
    n.expands = { ...this.expands };
    n.filters = [...this.filters];
    n.groupByBuilder = this.groupByBuilder === null ? null : this.groupByBuilder.clone(n);
    n.orderByList = [...this.orderByList];
    n.apiVersion = this.apiVersion;
    n.top = this.top;
    n.skip = this.skip;
    n.parameters = { ...this.parameters };
    return n;
  }

  /**
   * set the api version.
   * @param val the api version
   */
  public setApiVersion(val: string | null): ODataQueryBuilder {
    this.apiVersion = val;
    return this;
  }

  /**
   * get total row count with response
   * @param val the value
   */
  public setAllPagesRowCount(val: boolean = true): ODataQueryBuilder {
    this.getAllPagesRowCount = val;
    return this;
  }

  public addColumn(columnName: string) {
    if (!_.isString(columnName) || _.isEmpty(columnName)) { return this; }
    for (const cn of columnName.split(',').map((x: string) => x.trim())) {
      if (!_.isEmpty(cn) && !_.includes(this.columns, cn)) {
        this.columns.push(cn);
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
      const index = this.columns.indexOf(cn);
      if (index >= 0) {
        this.columns.splice(index, 1);
      }
    }
    return this;
  }

  public clearColumns(): ODataQueryBuilder {
    this.columns = [];
    return this;
  }

  public addExpandColumns(...columnNames: string[]): ODataQueryBuilder {
    if (!columnNames || !columnNames.length) { return this; }
    for (const cn of columnNames) {
      const split = cn.split('.');
      if (split.length === 1) {
        this.addColumns(cn);
      } else { // if (split.length > 1) sadece bu durum kalıyor
        let exp: ExpandBuilder;
        if (Object.keys(this.expands).indexOf(split[0]) < 0) {
          exp = new ExpandBuilder(split[0]);
          this.expands[split[0]] = exp;
        } else {
          exp = this.expands[split[0]];
        }
        exp.addExpandFromString(cn);
      }
    }
    return this;
  }

  public addExpand(...expands: ExpandBuilder[]): ODataQueryBuilder {
    if (!expands || !expands.length) { return this; }
    for (const expand of expands) {
      this.expands[expand.propertyName] = expand;
    }
    return this;
  }

  public addFilters(...filters: Array<string | Expression>): ODataQueryBuilder {
    if (!filters || !filters.length) { return this; }
    for (const c of filters.filter((x) => x !== null)) {
      if (_.isString(c) && !_.isEmpty(c)) {
        this.filters.push(c);
      } else if (isExpression(c) && !_.isEmpty(c.text)) {
        this.filters.push(c);
      }
    }
    return this;
  }

  public clearFilters() {
    this.filters = [];
    return this;
  }

  public addOrderBy(column: string, direction: OrderByDirection = OrderByDirection.Asc): ODataQueryBuilder {
    const c = column.trim();
    if (!_.isEmpty(c)) {
      this.orderByList.push(c + (direction === OrderByDirection.Asc ? '' : ' desc'));
    }
    return this;
  }

  public addOrderByDesc(column: string): ODataQueryBuilder {
    const c = column.trim();
    if (!_.isEmpty(c)) {
      this.orderByList.push(c + ' desc');
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
          this.orderByList.push(...cols);
        }
      }
    }
    return this;
  }

  public clearOrderByList(): ODataQueryBuilder {
    this.orderByList = [];
    return this;
  }

  public setTop(value: number): ODataQueryBuilder {
    this.top = value;
    return this;
  }

  public setSkip(value: number): ODataQueryBuilder {
    this.skip = value;
    return this;
  }

  public addParameter(parameterName: string, value: any): ODataQueryBuilder;
  public addParameter(parameter: Parameter): ODataQueryBuilder;

  public addParameter(parameterName: string | Parameter, value?: any): ODataQueryBuilder {
    if (_.isString(parameterName)) {
      const p = new Parameter(parameterName as string, value);
      this.parameters[p.parameterName] = p;
    } else { // if (isParameter(parameterName))  sadece bu durum kalıyor.
      this.parameters[(parameterName as Parameter).parameterName] = parameterName;
    }
    return this;
  }

  public addParameters(parameter: Parameter): ODataQueryBuilder;
  public addParameters(parameterList: Parameter[]): ODataQueryBuilder;
  public addParameters(parameters: _.Dictionary<Parameter>): ODataQueryBuilder;

  public addParameters(parameters: _.Dictionary<Parameter> | Parameter[] | Parameter): ODataQueryBuilder {
    if (_.isArray(parameters)) {
      for (const p of parameters) {
        this.parameters[p.name] = p;
      }
    } else if (isParameter(parameters)) {
      this.parameters[parameters.name] = parameters;
    } else { // if (_.isObject(parameters))  sadece bu durum kalıyor.
      this.parameters = {
        ...this.parameters,
        ...parameters,
      };
    }
    return this;
  }

  public removeParameter(parameterName: string) {
    if (Object.keys(this.parameters).some((x) => x === parameterName)) {
      delete this.parameters[parameterName];
    }
    return this;
  }

  public clearParameters(): ODataQueryBuilder {
    this.parameters = {};
    return this;
  }

  // #region Group By

  public get groupBy(): GroupByBuilder {
    if (this.groupByBuilder === null) {
      this.groupByBuilder = new GroupByBuilder(this);
    }
    return this.groupByBuilder;
  }

  // #endregion

  public getQuery(): ODataQuery {
    const q = new ODataQuery(this.resource, this.connectionService, this.additionalQueryStrings);

    if (Object.keys(this.expands).length > 0) {
      q.expand(Object.keys(this.expands).map((x: string) => this.expands[x]));
    }

    if (!_.isEmpty(this.columns)) {
      q.select(this.columns.join(','));
    }

    if (this.groupByBuilder !== null && !this.groupByBuilder.isEmpty) {
      q.apply(this.groupByBuilder.toString());
      const havingString = this.groupByBuilder.havingString;
      if (!_.isEmpty(havingString)) {
        q.filter(havingString);
      }
    } else {
      const filters = prepareFilterString(this.filters);
      if (!_.isEmpty(filters)) { q.filter(filters); }
    }

    if (this.orderByList.length > 0) {
      const orderByList = this.orderByList.filter((x: string) => !_.isEmpty(x.trim()));
      // buradaki if'i this._orderByList içinde boş string olmamasını garantili hale getirmiş olduğum için sildim.
      q.orderBy(...orderByList);
    }

    if (this.apiVersion !== null && _.isString(this.apiVersion) && !_.isEmpty(this.apiVersion)) {
      q.apiVersion(this.apiVersion);
    }

    if (this.top > 0) {
      q.top(this.top);
    }

    if (this.skip > 0) {
      q.skip(this.skip);
    }

    if (this.getAllPagesRowCount) {
      q.allPagesRowCount(true);
    }

    const parameters = Object.keys(this.parameters);
    if (parameters.length > 0) {
      q.parameters(...parameters.map((x) => this.parameters[x].toString()));
    }

    return q;
  }

  public get filterString(): string {
    return prepareFilterString(this.filters);
  }

  public q(): Promise<any> {
    return this.getQuery().q();
  }
}


export function prepareFilterString(filterArray: any[]): string {
  if (_.isEmpty(filterArray)) { return String(); }
  const filters = filterArray
    .filter((x: any) => _.isString(x))
    .map((x: any) => x as string);
  const f2 = filterArray
    .filter((x: any) => isExpression(x) && !_.isEmpty(x.text))
    .map((x: Expression) => x.text);

  if (f2.length > 0) { filters.push(...f2); }
  if (filters.length === 1) {
    return filters[0];
  } else if (filters.length > 1) {
    return filters.join(' and ');
  }
  return String();
}
