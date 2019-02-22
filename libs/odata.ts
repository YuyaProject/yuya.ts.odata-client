import moment from 'moment';
import _ from 'lodash';

export function getODataDateTimeString(val: any): string {
  try {
    if (_.isNull(val) || _.isUndefined(val) || _.isBoolean(val) || (_.isString(val) && _.isEmpty(val))) {
      return String();
    }
    return moment(val).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
  } catch {
    return String();
  }
}
