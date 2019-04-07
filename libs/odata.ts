import moment from 'moment';
import _ from 'lodash';
import { isIProperty, isExpression, isParameter, Guid, Expression } from './types';

export function getODataDateTimeString(val: any): string {
  if (_.isNull(val)
    || _.isUndefined(val)
    || _.isBoolean(val)
    || (_.isString(val) && _.isEmpty(val))
    || (_.isObject(val) && !moment.isMoment(val) && !_.isDate(val) && !_.isString(val))
  ) {
    return String();
  }
  const m = moment(val);
  return m.isValid() ? m.format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]') : String();
}

export function encodeQueryValue(val: any): string {
  if (val === undefined || val === null) { return 'null'; }
  if (Guid.isGuid(val)) { return val.value; }
  if (isParameter(val)) { return val.parameterName; }
  if (isIProperty(val) && !_.isEmpty(val.name)) { return val.name.trim(); }
  if (isExpression(val) && val.text !== undefined) { return val.toString().trim(); }
  if (_.isString(val)) { return `'${val.trim()}'`; }
  if (_.isNumber(val)) { return `${val}`; }
  if (_.isBoolean(val)) { return !val ? 'false' : 'true'; }
  if (_.isDate(val) || moment.isMoment(val)) { return getODataDateTimeString(val); }
  if (_.isArray(val)) { return JSON.stringify(val); }
  return JSON.stringify(val);
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

export function splitWithComma(stringArray: string[], trimItems: boolean = false, removeWhitespaces: boolean = false): string[] {
  if (!stringArray || _.isEmpty(stringArray)) return [];
  let result: string[] = [];
  for (const item of stringArray) {
    let items = item.split(',');
    if (trimItems) {
      items = items.map(i => i.trim());
    }
    if (removeWhitespaces) {
      items = items.filter(i => !_.isEmpty(i));
    }
    result.push(...items);
  }
  return result;
}
