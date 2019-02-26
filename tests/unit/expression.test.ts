import { Expression, isExpression } from '../../libs/expression';


describe('expression tests', () => {
  // #region method : constructor
  it('prop empty parameter', () => {
    const p = new Expression('');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('');
  });
  it('prop non-empty parameter', () => {
    const p = new Expression('asd');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('asd');
  });
  // #endregion

  // #region method : constructor
  it('isExpression null parameter', () => {
    const p = isExpression(null);
    expect(p).not.toBe(true);
  });
  it('isExpression string parameter', () => {
    const p = isExpression('asd');
    expect(p).not.toBe(true);
  });
  it('isExpression expression parameter', () => {
    const p = isExpression(new Expression('asd'));
    expect(p).toBe(true);
  });
  // #endregion

});
