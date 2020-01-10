import _ from 'lodash';
import { OData, IProperty, Expression, Parameter, isIProperty } from '.';
import moment from 'moment';

export function prop(name: string): IProperty {
  return { name };
}

export function param(name: string, value: any): Parameter {
  return new Parameter(name, value);
}

export function equals(left: any, right: any): Expression {
  return new Expression(`${OData.encodeQueryValue(left)} eq ${OData.encodeQueryValue(right)}`);
}

export function notEquals(left: any, right: any): Expression {
  return new Expression(`${OData.encodeQueryValue(left)} ne ${OData.encodeQueryValue(right)}`);
}

export function gt(left: any, right: any): Expression {
  return new Expression(`${OData.encodeQueryValue(left)} gt ${OData.encodeQueryValue(right)}`);
}

export function ge(left: any, right: any): Expression {
  return new Expression(`${OData.encodeQueryValue(left)} ge ${OData.encodeQueryValue(right)}`);
}

export function lt(left: any, right: any): Expression {
  return new Expression(`${OData.encodeQueryValue(left)} lt ${OData.encodeQueryValue(right)}`);
}

export function le(left: any, right: any): Expression {
  return new Expression(`${OData.encodeQueryValue(left)} le ${OData.encodeQueryValue(right)}`);
}

export function inList(left: IProperty, right: any[]): Expression | null {
  return (!right || !right.length)
    ? null
    : new Expression(`${OData.encodeQueryValue(left)} in (${right.map((x: any) => OData.encodeQueryValue(x)).join(',')})`);
}

export function and(left: any, right: any): Expression {
  return new Expression(`${OData.encodeQueryValue(left)} and ${OData.encodeQueryValue(right)}`);
}

export function or(left: any, right: any): Expression {
  return new Expression(`${OData.encodeQueryValue(left)} or ${OData.encodeQueryValue(right)}`);
}

export function not(right: Expression): Expression {
  let inner = OData.encodeQueryValue(right);
  if (!inner.startsWith('(') || !inner.endsWith(')')) {
    inner = `(${inner})`;
  }
  return new Expression(`not${inner}`);
}

export function group(inside: Expression): Expression {
  return new Expression(`(${OData.encodeQueryValue(inside)})`);
}

export function contains(left: IProperty, right: string): Expression {
  return new Expression(`contains(${OData.encodeQueryValue(left)},${OData.encodeQueryValue(right)})`);
}

export function startswith(left: IProperty, right: string): Expression {
  return new Expression(`startswith(${OData.encodeQueryValue(left)},${OData.encodeQueryValue(right)})`);
}

export function endswith(left: IProperty, right: string): Expression {
  return new Expression(`endswith(${OData.encodeQueryValue(left)},${OData.encodeQueryValue(right)})`);
}

export function length(inside: IProperty): Expression {
  return new Expression(`length(${OData.encodeQueryValue(inside)})`);
}

export function indexof(property: IProperty, searchText: string): Expression {
  return new Expression(`indexof(${OData.encodeQueryValue(property)}, ${OData.encodeQueryValue(searchText)})`);
}

export function any(collectionName: string, aliasName: string, ...subFilters: Array<string | Expression>)
  : Expression | null {
  if (_.isEmpty(collectionName) || _.isEmpty(aliasName) || _.isEmpty(subFilters)) {
    return null;
  }
  return new Expression(`${collectionName}/any(${aliasName}:(${subFilters.join(')and(')}))`);
}

export function all(collectionName: string, aliasName: string, ...subFilters: Array<string | Expression>)
  : Expression | null {
  if (_.isEmpty(collectionName) || _.isEmpty(aliasName) || _.isEmpty(subFilters)) {
    return null;
  }
  return new Expression(`${collectionName}/all(${aliasName}:(${subFilters.join(')and(')}))`);
}

export function dateValue(date: any): Expression | null {
  try {
    const m = moment(date);
    return m.isValid() ? new Expression(m.format('YYYY-MM-DD')) : null;
  } catch {
    return null;
  }
}

export function dateFunction(date: Expression | IProperty): Expression {
  if (isIProperty(date) && !_.isEmpty(date.name)) {
    return new Expression(`date(${date.name.trim()})`);
  }
  return new Expression(`date(${date.toString()})`);
}

export function yearFunction(date: Expression | IProperty): Expression {
  if (isIProperty(date) && !_.isEmpty(date.name)) {
    return new Expression(`year(${date.name.trim()})`);
  }
  return new Expression(`year(${date.toString()})`);
}

export function monthFunction(date: Expression | IProperty): Expression {
  if (isIProperty(date) && !_.isEmpty(date.name)) {
    return new Expression(`month(${date.name.trim()})`);
  }
  return new Expression(`month(${date.toString()})`);
}

export function dayFunction(date: Expression | IProperty): Expression {
  if (isIProperty(date) && !_.isEmpty(date.name)) {
    return new Expression(`day(${date.name.trim()})`);
  }
  return new Expression(`day(${date.toString()})`);
}
