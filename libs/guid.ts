import _ from 'lodash';

const guidTypeString = 'Guid';

export class Guid {
  private _type = guidTypeString;
  private _guid: string;

  public static readonly guidRegex = new RegExp(/^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/);

  constructor(value: string | Guid) {
    if (value === undefined) {
      throw new Error('value not found');
    }
    if (_.isString(value) && !_.isEmpty(value) && Guid.guidRegex.test(value)) {
      this._guid = value;
    } else if (Guid.isGuid(value)) {
      this._guid = value._guid;
    } else {
      throw new Error('value format error');
    }
  }

  public get value() {
    return this._guid;
  }

  public toString() {
    return this._guid;
  }

  public static isGuid(val: any): val is Guid {
    const vguid = val as Guid;
    return !!vguid && vguid._type !== undefined && vguid._type === guidTypeString && vguid._guid !== undefined;
  }

  private static readonly _empty = new Guid('00000000-0000-0000-0000-000000000000');
  public static get Empty() {
    return this._empty;
  }

}

