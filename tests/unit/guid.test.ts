import { Guid } from '../../libs/guid';

describe('Guid tests', () => {
  // #region method : getODataDateTimeString
  it('constructor empty string parameter', () => {
    expect(() => new Guid('')).toThrowError('value format error');
  });
  it('constructor non-empty incorrect string parameter', () => {
    expect(() => new Guid('asd')).toThrowError('value format error');
  });
  it('constructor non-empty correct string parameter', () => {
    const g = new Guid('2B7B96BB-4A11-45B5-B0BB-3A43174AF061');
    expect(g).not.toBeNull();
    expect(g.value).toEqual('2B7B96BB-4A11-45B5-B0BB-3A43174AF061');
  });
  it('constructor non-empty guid parameter', () => {
    const g = new Guid('2B7B96BB-4A11-45B5-B0BB-3A43174AF061');
    const h = new Guid(g);
    expect(g).not.toBeNull();
    expect(g.value).toEqual('2B7B96BB-4A11-45B5-B0BB-3A43174AF061');
    expect(h).not.toBeNull();
    expect(h.value).toEqual('2B7B96BB-4A11-45B5-B0BB-3A43174AF061');
  });
  it('constructor empty guid parameter', () => {
    const g = Guid.Empty;
    expect(g).not.toBeNull();
    expect(g.value).toEqual('00000000-0000-0000-0000-000000000000');
  });
  // #endregion


  // #region method : toString
  it('toString', () => {
    const g = new Guid('2B7B96BB-4A11-45B5-B0BB-3A43174AF061');
    expect(g).not.toBeNull();
    expect(g.value).toEqual('2B7B96BB-4A11-45B5-B0BB-3A43174AF061');
    expect(g.toString()).toEqual('2B7B96BB-4A11-45B5-B0BB-3A43174AF061');
  });
  // #endregion
});
