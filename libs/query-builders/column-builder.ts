import _ from 'lodash';
import { ODataQueryBuilder } from '../odata-query-builder';

export class ColumnBuilder {
  private _odataQueryBuilder: ODataQueryBuilder;

  // tslint:disable-next-line:variable-name
  private _columns: string[] = [];

  constructor(odataQueryBuilder: ODataQueryBuilder) {
    this._odataQueryBuilder = odataQueryBuilder;
  }

  public get isEmpty(): boolean {
    return _.isEmpty(this._columns);
  }

  // #region columns
  public add(columnName: string) {
    if (!_.isString(columnName) || _.isEmpty(columnName)) { return this; }
    for (const cn of columnName.split(',').map((x: string) => x.trim())) {
      if (!_.isEmpty(cn) && !_.some(this._columns, cn)) {
        this._columns.push(cn);
      }
    }
    return this;
  }

  public addArray(...columnNames: string[]): ColumnBuilder;
  public addArray(columnNames: string): ColumnBuilder;

  public addArray(...columnNames: string[]): ColumnBuilder {
    if (!_.isArray(columnNames) || _.isEmpty(columnNames)) { return this; }
    for (const cn of columnNames.map((x: string) => x.trim())) {
      this.add(cn);
    }
    return this;
  }

  public removeArray(...columnNames: string[]): ColumnBuilder {
    if (!columnNames || !columnNames.length) { return this; }
    for (const cn of columnNames) {
      const index = this._columns.indexOf(cn);
      if (index >= 0) {
        this._columns.splice(index, 1);
      }
    }
    return this;
  }

  public clearColumns(): ColumnBuilder {
    this._columns = [];
    return this;
  }
  // #endregion
  

  public toString(): string {
    if (this.isEmpty) { return String(); }
    return this._columns.join(',');
  }
}
