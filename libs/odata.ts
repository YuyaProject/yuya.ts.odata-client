import moment from 'moment';
import _ from 'lodash';
import { isIProperty, isExpression, isParameter } from '.';

export function getODataDateTimeString(val: any): string {
  try {
    if (_.isNull(val)
      || _.isUndefined(val)
      || _.isBoolean(val)
      || (_.isString(val) && _.isEmpty(val))
      || (_.isObject(val) && !moment.isMoment(val) && !_.isDate(val) && !_.isString(val))
    ) {
      return String();
    }
    return moment(val).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  } catch {
    return String();
  }
}

export function encodeQueryValue(val: any): string {
  if (val === undefined || val === null) { return 'null'; }
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

