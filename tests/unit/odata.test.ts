import * as OData from '../../libs/odata';
import moment from 'moment';
import { Parameter, Expression, Guid } from '../../libs';

// aylar 0 dan başlayarak sayıldığı için şubat için 1 değerini girdim.
const dateConstant = new Date(2019, 1, 22, 8, 11, 0);
const dateStringConstant = '2019-02-22T08:11:00.000Z';
const dateStringConstant2 = '2019-02-22T00:00:00.000Z';

describe('odata tests', () => {
  // #region method : getODataDateTimeString
  it('getODataDateTimeString null parameter', () => {
    const p = OData.getODataDateTimeString(null);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('');
  });
  it('getODataDateTimeString empty parameter', () => {
    const p = OData.getODataDateTimeString('');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('');
  });
  it('getODataDateTimeString boolean parameter', () => {
    const p = OData.getODataDateTimeString(true);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('');
  });
  it('getODataDateTimeString object parameter', () => {
    const p = OData.getODataDateTimeString({ id: 5 });
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('');
  });
  it('getODataDateTimeString Date parameter', () => {
    const p = OData.getODataDateTimeString(dateConstant);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual(dateStringConstant);
  });
  it('getODataDateTimeString Moment parameter', () => {
    const p = OData.getODataDateTimeString(moment(dateConstant));
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual(dateStringConstant);
  });
  it('getODataDateTimeString number parameter', () => {
    const p = OData.getODataDateTimeString(dateConstant.getTime());
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual(dateStringConstant);
  });
  it('getODataDateTimeString string parameter', () => {
    const p = OData.getODataDateTimeString('2019-02-22T08:11:00');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual(dateStringConstant);
  });
  it('getODataDateTimeString string parameter 2', () => {
    const p = OData.getODataDateTimeString('2019-02-22 08:11:00');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual(dateStringConstant);
  });
  it('getODataDateTimeString string parameter 3', () => {
    const p = OData.getODataDateTimeString('2019-02-22 08:11');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual(dateStringConstant);
  });
  it('getODataDateTimeString string parameter 4', () => {
    const p = OData.getODataDateTimeString('2019-02-22');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual(dateStringConstant2);
  });

  it('getODataDateTimeString wrong formated string parameter', () => {
    const p = OData.getODataDateTimeString('2019-22-22T08:11:00');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('');
  });
  // #endregion

  // #region method : encodeQueryValue
  it('encodeQueryValue undefined parameter', () => {
    const p = OData.encodeQueryValue(undefined);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('null');
  });
  it('encodeQueryValue null parameter', () => {
    const p = OData.encodeQueryValue(null);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('null');
  });
  it('encodeQueryValue empty string parameter', () => {
    const p = OData.encodeQueryValue('');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual("''");
  });
  it('encodeQueryValue string parameter', () => {
    const p = OData.encodeQueryValue('asd');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual("'asd'");
  });
  it('encodeQueryValue number parameter', () => {
    const p = OData.encodeQueryValue(5);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('5');
  });
  it('encodeQueryValue boolean true parameter', () => {
    const p = OData.encodeQueryValue(true);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('true');
  });
  it('encodeQueryValue boolean true parameter', () => {
    const p = OData.encodeQueryValue(false);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('false');
  });
  it('encodeQueryValue date parameter', () => {
    const p = OData.encodeQueryValue(new Date(2018, 1, 26, 14, 3, 0));
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('2018-02-26T14:03:00.000Z');
  });
  it('encodeQueryValue moment parameter', () => {
    const p = OData.encodeQueryValue(moment(new Date(2018, 1, 26, 14, 3, 0)));
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('2018-02-26T14:03:00.000Z');
  });
  it('encodeQueryValue array parameter', () => {
    const p = OData.encodeQueryValue([1, 2, 3]);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('[1,2,3]');
  });
  it('encodeQueryValue parameter parameter', () => {
    const p = OData.encodeQueryValue(new Parameter('a', 1));
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('@a');
  });
  it('encodeQueryValue property parameter', () => {
    const p = OData.encodeQueryValue({ name: 'a' });
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('a');
  });
  it('encodeQueryValue expression parameter', () => {
    const p = OData.encodeQueryValue(new Expression('id eq 5'));
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('id eq 5');
  });
  it('encodeQueryValue object parameter', () => {
    const p = OData.encodeQueryValue({ id: 5 });
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('{"id":5}');
  });
  it('encodeQueryValue guid parameter', () => {
    const p = OData.encodeQueryValue(new Guid('2B7B96BB-4A11-45B5-B0BB-3A43174AF061'));
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('2B7B96BB-4A11-45B5-B0BB-3A43174AF061');
  });
  // #endregion

});
