import _ from 'lodash';
import { OData } from '.';
import moment, { Moment } from 'moment';

export interface IProperty {
  name: string;
}

export class Expression {
  public text: string;
  constructor(t: string) {
    this.text = t;
  }

  public toString() {
    return this.text;
  }
}

export type FilterValue = IProperty | Expression | string | number | Date | boolean | Moment | null | undefined | any;

export function isIProperty(val: any): val is IProperty {
  const vproperty = val as IProperty;
  return !!vproperty;
}

export function isExpression(val: any): val is Expression {
  const vexpression = val as Expression;
  return !!vexpression;
}

function write(val: FilterValue): string {
  if (val === undefined || val === null) { return 'null'; }
  if (isIProperty(val) && val.name !== undefined) { return val.name.trim(); }
  if (isExpression(val) && val.text !== undefined) { return val.toString().trim(); }
  if (_.isString(val)) { return `'${val.trim()}'`; }
  if (_.isNumber(val)) { return `${val}`; }
  if (_.isBoolean(val)) { return !val ? 'false' : 'true'; }
  if (_.isDate(val) || moment.isMoment(val)) { return OData.getODataDateTimeString(val); }
  return val.toString();
}

export function prop(name: string): IProperty {
  return { name };
}

export function equals(left: FilterValue, right: FilterValue): Expression {
  return new Expression(`${write(left)} eq ${write(right)}`);
}

export function notEquals(left: FilterValue, right: FilterValue): Expression {
  return new Expression(`${write(left)} ne ${write(right)}`);
}

export function gt(left: FilterValue, right: FilterValue): Expression {
  return new Expression(`${write(left)} gt ${write(right)}`);
}

export function ge(left: FilterValue, right: FilterValue): Expression {
  return new Expression(`${write(left)} ge ${write(right)}`);
}

export function lt(left: FilterValue, right: FilterValue): Expression {
  return new Expression(`${write(left)} lt ${write(right)}`);
}

export function le(left: FilterValue, right: FilterValue): Expression {
  return new Expression(`${write(left)} le ${write(right)}`);
}

export function inList(left: IProperty, right: any[]): Expression | null {
  return (!right || !right.length)
    ? null
    : new Expression(`${write(left)} in (${right.map((x: any) => write(x)).join(',')})`);
}

export function and(left: FilterValue, right: FilterValue): Expression {
  return new Expression(`${write(left)} and ${write(right)}`);
}

export function or(left: FilterValue, right: FilterValue): Expression {
  return new Expression(`${write(left)} or ${write(right)}`);
}

export function not(right: Expression): Expression {
  let inner = write(right);
  if (!inner.startsWith('(') || !inner.endsWith(')')) {
    inner = `(${inner})`;
  }
  return new Expression(`not${inner}`);
}

export function group(inside: Expression): Expression {
  return new Expression(`(${write(inside)})`);
}

export function contains(left: IProperty, right: string): Expression {
  return new Expression(`contains(${write(left)},${write(right)})`);
}

export function startswith(left: IProperty, right: string): Expression {
  return new Expression(`startswith(${write(left)},${write(right)})`);
}

export function endswith(left: IProperty, right: string): Expression {
  return new Expression(`endswith(${write(left)},${write(right)})`);
}

export function length(inside: IProperty): Expression {
  return new Expression(`length(${write(inside)})`);
}

export function indexof(property: IProperty, searchText: string): Expression {
  return new Expression(`indexof(${write(property)}, ${write(searchText)})`);
}
