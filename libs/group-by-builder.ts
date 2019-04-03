import _ from 'lodash';
import { ODataQueryBuilder, Expression, isExpression } from '.';
import { prepareFilterString } from './odata-query-builder';

export class GroupByBuilder {
  private _odataQueryBuilder: ODataQueryBuilder;

  // tslint:disable-next-line:variable-name
  private _columns: string[] = [];
  // tslint:disable-next-line:variable-name
  private _aggregates: IGroupByAggregate[] = [];
  // tslint:disable-next-line:variable-name
  private _havings: any[] = [];

  constructor(odataQueryBuilder: ODataQueryBuilder) {
    this._odataQueryBuilder = odataQueryBuilder;
  }

  public get isEmpty(): boolean {
    return _.isEmpty(this._columns) && _.isEmpty(this._aggregates) && _.isEmpty(this._havings);
  }

  public get havingString(): string {
    return prepareFilterString(this._havings);
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

  public addColumns(...columnNames: string[]): GroupByBuilder;
  public addColumns(columnNames: string): GroupByBuilder;
  public addColumns(...columnNames: string[]): GroupByBuilder {
    if (!_.isArray(columnNames) || _.isEmpty(columnNames)) { return this; }
    for (const cn of columnNames.map((x: string) => x.trim())) {
      this.addColumn(cn);
    }
    return this;
  }

  public addSumColumn(columnOrExpression: string, alias: string): GroupByBuilder {
    if (_.isEmpty(columnOrExpression) || _.isEmpty(alias)) { return this; }
    var aggregate: IGroupByAggregate = new SumGroupByAggreage(columnOrExpression, alias);
    this._aggregates.push(aggregate);
    return this;
  }

  public addMinColumn(columnOrExpression: string, alias: string): GroupByBuilder {
    if (_.isEmpty(columnOrExpression) || _.isEmpty(alias)) { return this; }
    var aggregate: IGroupByAggregate = new MinGroupByAggreage(columnOrExpression, alias);
    this._aggregates.push(aggregate);
    return this;
  }

  public addMaxColumn(columnOrExpression: string, alias: string): GroupByBuilder {
    if (_.isEmpty(columnOrExpression) || _.isEmpty(alias)) { return this; }
    var aggregate: IGroupByAggregate = new MaxGroupByAggreage(columnOrExpression, alias);
    this._aggregates.push(aggregate);
    return this;
  }

  public addAverageColumn(columnOrExpression: string, alias: string): GroupByBuilder {
    if (_.isEmpty(columnOrExpression) || _.isEmpty(alias)) { return this; }
    var aggregate: IGroupByAggregate = new AverageGroupByAggreage(columnOrExpression, alias);
    this._aggregates.push(aggregate);
    return this;
  }

  public addHavings(...filters: (string | Expression)[]): GroupByBuilder {
    if (!filters || _.isEmpty(filters)) { return this; }
    for (const c of filters.filter((x) => x !== null)) {
      if (_.isString(c) && !_.isEmpty(c)) {
        this._havings.push(c);
      } else if (isExpression(c) && !_.isEmpty(c.text)) {
        this._havings.push(c);
      }
    }
    return this;
  }

  public toString(): string {
    if (this.isEmpty) { return String(); }
    const l: string[] = [];
    const filterStringFromRoot = this._odataQueryBuilder.filterString;
    if (!_.isEmpty(filterStringFromRoot)) {
      l.push(`filter(${filterStringFromRoot})`);
    }

    const m: string[] = [];

    const groupByColumns = this._columns.join(',');
    if (!_.isEmpty(groupByColumns)) m.push('(' + groupByColumns + ')');

    const groupByAggregates = this._aggregates.map(x => x.toString()).join(',');
    if (!_.isEmpty(groupByAggregates)) m.push('aggregate(' + groupByAggregates + ')');

    l.push(`groupby(${m.join(',')})`);

    return l.join('/');
  }
}

export enum OperatorsEnum {
  Sum,
  Min,
  Max,
  Average,
  Count
}

export interface IGroupByAggregate {
  columnOrExpression: string;
  operator: OperatorsEnum;
  alias: string;
}

class SumGroupByAggreage implements IGroupByAggregate {
  public columnOrExpression: string;
  public operator: OperatorsEnum;
  public alias: string;

  constructor(columnOrExpression: string, alias: string) {
    this.columnOrExpression = columnOrExpression;
    this.alias = alias;
    this.operator = OperatorsEnum.Sum;
  }

  public toString(): string {
    return `${this.columnOrExpression} with sum as ${this.alias}`;
  }
}

class MinGroupByAggreage implements IGroupByAggregate {
  public columnOrExpression: string;
  public operator: OperatorsEnum;
  public alias: string;

  constructor(columnOrExpression: string, alias: string) {
    this.columnOrExpression = columnOrExpression;
    this.alias = alias;
    this.operator = OperatorsEnum.Min;
  }

  public toString(): string {
    return `${this.columnOrExpression} with min as ${this.alias}`;
  }
}

class MaxGroupByAggreage implements IGroupByAggregate {
  public columnOrExpression: string;
  public operator: OperatorsEnum;
  public alias: string;

  constructor(columnOrExpression: string, alias: string) {
    this.columnOrExpression = columnOrExpression;
    this.alias = alias;
    this.operator = OperatorsEnum.Max;
  }

  public toString(): string {
    return `${this.columnOrExpression} with max as ${this.alias}`;
  }
}

class AverageGroupByAggreage implements IGroupByAggregate {
  public columnOrExpression: string;
  public operator: OperatorsEnum;
  public alias: string;

  constructor(columnOrExpression: string, alias: string) {
    this.columnOrExpression = columnOrExpression;
    this.alias = alias;
    this.operator = OperatorsEnum.Average;
  }

  public toString(): string {
    return `${this.columnOrExpression} with average as ${this.alias}`;
  }
}
