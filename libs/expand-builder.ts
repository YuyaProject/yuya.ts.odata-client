import _ from 'lodash';

export class ExpandBuilder {
  private propertyName: string;
  private selectColumns: string[] = [];
  private filter: string = '';
  private sort: string = '';
  private expands: ExpandBuilder[] = [];

  constructor(propertyName: string) {
    if (!_.isString(propertyName) || _.isEmpty(propertyName)) { throw new Error('property name is null or empty'); }
    this.propertyName = propertyName;
  }

  public addColumn(columnName: string): ExpandBuilder {
    if (!columnName || !(columnName.length)) { return this; }
    if (columnName.match(/,/)) {
      this.addColumns(...(columnName.split(',')));
      return this;
    }
    if (this.selectColumns.some((x: string) => x === columnName)) { return this; }
    this.selectColumns.push(columnName);
    return this;
  }

  public addColumns(...columnNames: string[]): ExpandBuilder {
    if (!columnNames || !(columnNames.length)) { return this; }
    for (const cn of columnNames.filter((x: string) => x && x.length)) {
      if (this.selectColumns.some((x: string) => x === cn)) { continue; }
      this.selectColumns.push(cn);
    }
    return this;
  }

  public setFilter(...filters: string[]): ExpandBuilder {
    if (!!filters && !!filters.length) {
      filters = filters.filter((x: string) => !!x && !_.isEmpty(x));
      if (filters.length === 1) {
        this.filter = filters[0];
      } else if (filters.length > 1) {
        this.filter = '(' + filters.join(')and(') + ')';
      }
    }
    return this;
  }

  public setOrderBy(...orderbys: string[]): ExpandBuilder {
    if (!!orderbys && !!orderbys.length) {
      orderbys = orderbys.filter((x: string) => !!x && !_.isEmpty(x));
      if (orderbys.length > 0) {
        this.sort = orderbys.join(',');
      }
    }
    return this;
  }

  public addExpand(...expands: ExpandBuilder[]): ExpandBuilder {
    if (!!expands && !_.isEmpty(expands)) {
      expands = expands.filter((x: ExpandBuilder) => !!x);
      if (!_.isEmpty(expands)) {
        this.expands.push(...expands);
      }
    }
    return this;
  }

  public addExpandFromString(expandString: string): ExpandBuilder {
    if (!expandString || _.isEmpty(expandString)) { return this; }
    const el = expandString.split('.');
    if (el.length === 1) {
      if (el[0] !== this.propertyName) { this.addColumn(el[0]); }
      return this;
    }
    if (el.length === 2) {
      if (el[0] === this.propertyName) {
        this.addColumn(el[1]);
      } else {
        const exp = this.expands.find((x: ExpandBuilder) => x.propertyName === el[0]);
        if (!exp) {
          this.addExpand(new ExpandBuilder(el[0]).addColumn(el[1]));
        } else {
          exp.addColumn(el[1]);
        }
      }
      return this;
    }

    let nextExpand = el.filter((x: string, i: number) => i !== 0).join('.');
    if (el[0] !== this.propertyName) {
      nextExpand = expandString;
      let exp = this.expands.find((x: ExpandBuilder) => x.propertyName === el[0]);
      if (exp) {
        exp.addExpandFromString(nextExpand);
      } else {
        exp = new ExpandBuilder(el[0]).addExpandFromString(nextExpand);
        this.addExpand(exp);
        // this.addColumn(el[0]);
      }
    } else {
      let exp = this.expands.find((x: ExpandBuilder) => x.propertyName === el[1]);
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
    if (this.expands.length) {
      list.push('$expand=' + this.expands.map((x: ExpandBuilder) => x.toString()).join(','));
    }
    if (!!this.filter && !_.isEmpty(this.filter)) {
      list.push('$filter=' + this.filter);
    }
    if (!!this.sort && !_.isEmpty(this.sort)) {
      list.push('$orderby=' + this.sort);
    }
    if (!!this.selectColumns && !_.isEmpty(this.selectColumns)) {
      this.selectColumns = this.selectColumns.map((x: string) => x.trim()).filter((x: string) => !_.isEmpty(x));
      if (!_.isEmpty(this.selectColumns)) {
        list.push('$select=' + this.selectColumns.join(','));
      }
    }
    if (list.length) {
      return `${this.propertyName}(${list.join(';')})`;
    } else {
      return this.propertyName;
    }
  }
}
