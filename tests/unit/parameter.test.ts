import { Parameter, isParameter } from '../../libs/parameter';


describe('parameter tests', () => {
  // #region method : constructor
  it('constructor empty parameter', () => {
    expect(() => new Parameter('', 3)).toThrow('Parameter Name is required.');
    // expect(e.message).toEqual('Parameter Name is required.');
  });
  it('constructor non-empty parameter', () => {
    const p = new Parameter('asd', 5);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.name).toEqual('asd');
    expect(p.parameterName).toEqual('@asd');
    expect(p.value).toEqual(5);
  });

  it('constructor non-empty parameter without value', () => {
    const p = new Parameter('asd');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.name).toEqual('asd');
    expect(p.parameterName).toEqual('@asd');
    expect(p.value).toBeNull();
  });

  it('constructor non-empty parameter with @ sign', () => {
    const p = new Parameter('@asd', 5);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.name).toEqual('asd');
    expect(p.parameterName).toEqual('@asd');
    expect(p.value).toEqual(5);
  });
  // #endregion

  // #region method : name property
  it('name property get', () => {
    const p = new Parameter('asd', 5);
    expect(p.name).toEqual('asd');
  });
  it('name property set', () => {
    const p = new Parameter('asd', 5);
    p.name = 'name';
    expect(p.name).toEqual('name');
  });
  it('name property set 2', () => {
    const p = new Parameter('asd', 5);
    p.name = '@name';
    expect(p.name).toEqual('name');
  });
  // #endregion

  // #region method : parameterName property
  it('parameterName property get', () => {
    const p = new Parameter('asd', 5);
    expect(p.parameterName).toEqual('@asd');
  });
  // #endregion

  // #region method : value property
  it('value property get', () => {
    const p = new Parameter('asd', 5);
    expect(p.value).toEqual(5);
  });
  it('value property set', () => {
    const p = new Parameter('asd', 5);
    p.value = 6;
    expect(p.value).toEqual(6);
  });
  // #endregion

  // #region method : constructor
  it('isParameter null parameter', () => {
    const p = isParameter(null);
    expect(p).not.toBe(true);
  });
  it('isParameter string parameter', () => {
    const p = isParameter('asd');
    expect(p).not.toBe(true);
  });
  it('isParameter property parameter', () => {
    const p = isParameter({ name: 'asd' });
    expect(p).not.toBe(true);
  });
  it('isParameter parameter parameter', () => {
    const p = isParameter(new Parameter('asd', 5));
    expect(p).toBe(true);
  });
  // #endregion

});
