import * as OData from '../../libs/odata';
import moment from 'moment';

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
  // #endregion

});
