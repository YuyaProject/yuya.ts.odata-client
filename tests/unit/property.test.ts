import { IProperty, isIProperty } from '../../libs/property';


describe('property tests', () => {
  // #region method : constructor
  it('prop empty parameter', () => {
    const p: IProperty = { name: '' };
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.name).toEqual('');
  });
  it('prop non-empty parameter', () => {
    const p: IProperty = { name: 'asd' };
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.name).toEqual('asd');
  });
  // #endregion

  // #region method : constructor
  it('isProperty null parameter', () => {
    const p = isIProperty(null);
    expect(p).not.toBe(true);
  });
  it('isProperty string parameter', () => {
    const p = isIProperty('asd');
    expect(p).not.toBe(true);
  });
  it('isProperty property parameter', () => {
    const p = isIProperty({ name: 'asd' });
    expect(p).toBe(true);
  });
  // #endregion

});
