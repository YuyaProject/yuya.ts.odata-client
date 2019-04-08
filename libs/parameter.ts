import { encodeQueryValue } from './odata';

export class Parameter {
  private _name: string;
  private _value: any;

  constructor(name: string, value?: any) {
    this._name = this.clearName(name);
    this._value = value === undefined ? null : value;
  }

  public get parameterName() {
    return '@' + this._name;
  }

  public get name() {
    return this._name;
  }

  public set name(name: string) {
    this._name = this.clearName(name);
  }

  public get value() {
    return this._value;
  }

  public set value(value: any) {
    this._value = value;
  }

  public toString(): string {
    return `${this.parameterName}=${encodeQueryValue(this._value)}`;
  }

  private clearName(name: string): string {
    if (name === undefined || name === null || name === '') {
      throw new Error('Parameter Name is required.');
    }
    name = name.trim();
    if (name.startsWith('@')) {
      return name.substr(1);
    }
    return name;
  }
}


export function isParameter(val: any): val is Parameter {
  const vparameter: any = val;
  return !!vparameter && vparameter._name !== undefined && vparameter._value !== undefined;
}
