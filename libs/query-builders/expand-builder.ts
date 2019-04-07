import _ from 'lodash';

export class ExpandBuilder {
  private _propertyName: string;
  private _selectColumns: string[] = [];
  private _filter: string = '';
  private _sort: string = '';
  private _expands: ExpandBuilder[] = [];

  constructor(propertyName: string) {
    if (!_.isString(propertyName) || _.isEmpty(propertyName)) { throw new Error('property name is null or empty'); }
    this._propertyName = propertyName;
  }

  public get propertyName(): string {
    return this._propertyName;
  }

  public addColumn(columnName: string): ExpandBuilder {
    if (!columnName || !(columnName.length)) { return this; }
    if (columnName.match(/,/)) {
      this.addColumns(...(columnName.split(',')));
      return this;
    }
    if (this._selectColumns.some((x: string) => x === columnName)) { return this; }
    this._selectColumns.push(columnName);
    return this;
  }

  public addColumns(...columnNames: string[]): ExpandBuilder {
    if (!columnNames || !(columnNames.length)) { return this; }
    for (const cn of columnNames.filter((x: string) => x && x.length)) {
      if (this._selectColumns.some((x: string) => x === cn)) { continue; }
      this._selectColumns.push(cn);
    }
    return this;
  }

  public setFilter(...filters: string[]): ExpandBuilder {
    if (!!filters && !!filters.length) {
      filters = filters.filter((x: string) => !!x && !_.isEmpty(x));
      if (filters.length === 1) {
        this._filter = filters[0];
      } else if (filters.length > 1) {
        this._filter = '(' + filters.join(')and(') + ')';
      }
    }
    return this;
  }

  public setOrderBy(...orderbys: string[]): ExpandBuilder {
    if (!!orderbys && !!orderbys.length) {
      orderbys = orderbys.filter((x: string) => !!x && !_.isEmpty(x));
      if (orderbys.length > 0) {
        this._sort = orderbys.join(',');
      }
    }
    return this;
  }

  public addExpand(...expands: ExpandBuilder[]): ExpandBuilder {
    if (!!expands && !_.isEmpty(expands)) {
      expands = expands.filter((x: ExpandBuilder) => !!x);
      if (!_.isEmpty(expands)) {
        this._expands.push(...expands);
      }
    }
    return this;
  }

  public addExpandFromString(expandString: string): ExpandBuilder {
    if (!expandString || _.isEmpty(expandString)) { return this; }
    const el = expandString.split('.');
    if (el.length === 1) {
      if (el[0] !== this._propertyName) { this.addColumn(el[0]); }
      return this;
    }
    if (el.length === 2) {
      if (el[0] === this._propertyName) {
        this.addColumn(el[1]);
      } else {
        const exp = this._expands.find((x: ExpandBuilder) => x._propertyName === el[0]);
        if (!exp) {
          this.addExpand(new ExpandBuilder(el[0]).addColumn(el[1]));
        } else {
          exp.addColumn(el[1]);
        }
      }
      return this;
    }

    let nextExpand = el.filter((x: string, i: number) => i !== 0).join('.');
    if (el[0] !== this._propertyName) {
      nextExpand = expandString;
      let exp = this._expands.find((x: ExpandBuilder) => x._propertyName === el[0]);
      if (exp) {
        exp.addExpandFromString(nextExpand);
      } else {
        exp = new ExpandBuilder(el[0]).addExpandFromString(nextExpand);
        this.addExpand(exp);
        // this.addColumn(el[0]);
      }
    } else {
      let exp = this._expands.find((x: ExpandBuilder) => x._propertyName === el[1]);
      if (exp) {
        exp.addExpandFromString(nextExpand);
      } else {
        exp = new ExpandBuilder(el[1]).addExpandFromString(nextExpand);
        this.addExpand(exp);
        // this.addColumn(el[1]);
      }
    }
    return this;
  }

  public toString(): string {
    const list: string[] = [];
    if (this._expands.length) {
      list.push('$expand=' + this._expands.map((x: ExpandBuilder) => x.toString()).join(','));
    }
    if (!!this._filter && !_.isEmpty(this._filter)) {
      list.push('$filter=' + this._filter);
    }
    if (!!this._sort && !_.isEmpty(this._sort)) {
      list.push('$orderby=' + this._sort);
    }
    if (!!this._selectColumns && !_.isEmpty(this._selectColumns)) {
      this._selectColumns = this._selectColumns.map((x: string) => x.trim()).filter((x: string) => !_.isEmpty(x));
      if (!_.isEmpty(this._selectColumns)) {
        list.push('$select=' + this._selectColumns.join(','));
      }
    }
    if (list.length) {
      return `${this._propertyName}(${list.join(';')})`;
    } else {
      return this._propertyName;
    }
  }
}
