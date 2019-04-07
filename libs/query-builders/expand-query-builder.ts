import _ from 'lodash';
import { ODataQueryBuilder, OData } from '..';
import { ExpandBuilder } from '.';

export class ExpandQuerydBuilder {
  private _odataQueryBuilder: ODataQueryBuilder;

  // tslint:disable-next-line:variable-name
  private _expands: _.Dictionary<ExpandBuilder> = {};

  constructor(odataQueryBuilder: ODataQueryBuilder) {
    this._odataQueryBuilder = odataQueryBuilder;
  }

  public get isEmpty(): boolean {
    return Object.keys(this._expands).length == 0;
  }


  // #region expand
  public addExpandColumns(...columnNames: string[]): ExpandQuerydBuilder {
    if (!columnNames || _.isEmpty(columnNames)) { return this; }
    for (const cn of OData.splitWithComma(columnNames, true, true)) {
      const split = cn.split('.');
      if (split.length === 1) {
        this.addSelectColumn(cn);
      } else { // if (split.length > 1) sadece bu durum kalıyor
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

  public addExpands(...expands: ExpandBuilder[]): ExpandQuerydBuilder {
    if (!expands || _.isEmpty(expands)) { return this; }
    for (const cn of expands) {
      this._expands[cn.propertyName] = cn;
    }
    return this;
  }

  public removeExpands(...expands: ExpandBuilder[]): ExpandQuerydBuilder;
  public removeExpands(...expands: string[]): ExpandQuerydBuilder;

  public removeExpands(...expands: (string | ExpandBuilder)[]): ExpandQuerydBuilder {
    if (!expands || _.isEmpty(expands)) { return this; }
    for (const cn of expands) {
      const propertyName = _.isString(cn) ? cn : cn.propertyName;
      if (Object.keys(this._expands).indexOf(propertyName) >= 0) {
        delete this._expands[propertyName];
      }
    }
    return this;
  }

  public clear(): ExpandQuerydBuilder {
    this._expands = {};
    return this;
  }

  // #endregion

  private addSelectColumn(columnNames: string) {
    this._odataQueryBuilder.columns.addArray(columnNames);
  }

  public toString(): string {
    if (this.isEmpty) { return String(); }
    return (Object.keys(this._expands).map((x: string) => this._expands[x].toString())).join(',');
  }
}
