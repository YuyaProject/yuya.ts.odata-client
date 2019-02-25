import * as FilterBuilder from '../../libs/filter-builder';

const dateConstant = new Date(2019, 1, 22, 8, 11, 0);
const dateStringConstant = '2019-02-22T08:11:00.000Z';

const dateConstant2 = new Date(2019, 1, 21, 8, 11, 0);
const dateStringConstant2 = '2019-02-21T08:11:00.000Z';

const dateConstant3 = new Date(2019, 1, 20, 8, 11, 0);
const dateStringConstant3 = '2019-02-20T08:11:00.000Z';

describe('filter-builder tests', () => {
  // #region method : constructor
  it('prop empty parameter', () => {
    const p = FilterBuilder.prop('');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.name).toEqual('');
  });
  it('prop non-empty parameter', () => {
    const p = FilterBuilder.prop('a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.name).toEqual('a');
  });
  // #endregion

  // #region method : equals
  it('equals string, string parameters', () => {
    const p = FilterBuilder.equals('a', 'a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('\'a\' eq \'a\'');
  });
  it('equals Property, null parameters', () => {
    const p = FilterBuilder.equals(FilterBuilder.prop('a'), null);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a eq null');
  });
  it('equals Property, undefined parameters', () => {
    const p = FilterBuilder.equals(FilterBuilder.prop('a'), undefined);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a eq null');
  });
  it('equals Property, string parameters', () => {
    const p = FilterBuilder.equals(FilterBuilder.prop('a'), 'a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a eq \'a\'');
  });

  it('equals number, number parameters', () => {
    const p = FilterBuilder.equals(1, 1);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('1 eq 1');
  });
  it('equals Property, number parameters', () => {
    const p = FilterBuilder.equals(FilterBuilder.prop('a'), 1);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a eq 1');
  });

  it('equals boolean, boolean parameters', () => {
    const p = FilterBuilder.equals(true, true);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('true eq true');
  });
  it('equals Property, boolean parameters', () => {
    const p = FilterBuilder.equals(FilterBuilder.prop('a'), false);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a eq false');
  });

  it('equals Date, Date parameters', () => {
    const p = FilterBuilder.equals(dateConstant, dateConstant);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual(dateStringConstant + ' eq ' + dateStringConstant);
  });
  it('equals Property, Date parameters', () => {
    const p = FilterBuilder.equals(FilterBuilder.prop('a'), dateConstant);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a eq ' + dateStringConstant);
  });
  // #endregion

  // #region method : notEquals
  it('notEquals string, string parameters', () => {
    const p = FilterBuilder.notEquals('a', 'a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('\'a\' ne \'a\'');
  });
  it('notEquals Property, string parameters', () => {
    const p = FilterBuilder.notEquals(FilterBuilder.prop('a'), 'a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a ne \'a\'');
  });

  it('notEquals number, number parameters', () => {
    const p = FilterBuilder.notEquals(1, 1);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('1 ne 1');
  });
  it('notEquals Property, number parameters', () => {
    const p = FilterBuilder.notEquals(FilterBuilder.prop('a'), 1);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a ne 1');
  });

  it('notEquals boolean, boolean parameters', () => {
    const p = FilterBuilder.notEquals(true, true);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('true ne true');
  });
  it('notEquals Property, boolean parameters', () => {
    const p = FilterBuilder.notEquals(FilterBuilder.prop('a'), false);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a ne false');
  });

  it('notEquals Date, Date parameters', () => {
    const p = FilterBuilder.notEquals(dateConstant, dateConstant);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual(dateStringConstant + ' ne ' + dateStringConstant);
  });
  it('notEquals Property, Date parameters', () => {
    const p = FilterBuilder.notEquals(FilterBuilder.prop('a'), dateConstant);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a ne ' + dateStringConstant);
  });
  // #endregion

  // #region method : gt
  it('gt string, string parameters', () => {
    const p = FilterBuilder.gt('a', 'a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('\'a\' gt \'a\'');
  });
  it('gt Property, string parameters', () => {
    const p = FilterBuilder.gt(FilterBuilder.prop('a'), 'a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a gt \'a\'');
  });

  it('gt number, number parameters', () => {
    const p = FilterBuilder.gt(1, 1);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('1 gt 1');
  });
  it('gt Property, number parameters', () => {
    const p = FilterBuilder.gt(FilterBuilder.prop('a'), 1);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a gt 1');
  });

  it('gt boolean, boolean parameters', () => {
    const p = FilterBuilder.gt(true, true);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('true gt true');
  });
  it('gt Property, boolean parameters', () => {
    const p = FilterBuilder.gt(FilterBuilder.prop('a'), false);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a gt false');
  });

  it('gt Date, Date parameters', () => {
    const p = FilterBuilder.gt(dateConstant, dateConstant);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual(dateStringConstant + ' gt ' + dateStringConstant);
  });
  it('gt Property, Date parameters', () => {
    const p = FilterBuilder.gt(FilterBuilder.prop('a'), dateConstant);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a gt ' + dateStringConstant);
  });
  // #endregion

  // #region method : ge
  it('ge string, string parameters', () => {
    const p = FilterBuilder.ge('a', 'a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('\'a\' ge \'a\'');
  });
  it('ge Property, string parameters', () => {
    const p = FilterBuilder.ge(FilterBuilder.prop('a'), 'a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a ge \'a\'');
  });

  it('ge number, number parameters', () => {
    const p = FilterBuilder.ge(1, 1);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('1 ge 1');
  });
  it('ge Property, number parameters', () => {
    const p = FilterBuilder.ge(FilterBuilder.prop('a'), 1);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a ge 1');
  });

  it('ge boolean, boolean parameters', () => {
    const p = FilterBuilder.ge(true, true);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('true ge true');
  });
  it('ge Property, boolean parameters', () => {
    const p = FilterBuilder.ge(FilterBuilder.prop('a'), false);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a ge false');
  });

  it('ge Date, Date parameters', () => {
    const p = FilterBuilder.ge(dateConstant, dateConstant);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual(dateStringConstant + ' ge ' + dateStringConstant);
  });
  it('ge Property, Date parameters', () => {
    const p = FilterBuilder.ge(FilterBuilder.prop('a'), dateConstant);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a ge ' + dateStringConstant);
  });
  // #endregion

  // #region method : lt
  it('lt string, string parameters', () => {
    const p = FilterBuilder.lt('a', 'a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('\'a\' lt \'a\'');
  });
  it('lt Property, string parameters', () => {
    const p = FilterBuilder.lt(FilterBuilder.prop('a'), 'a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a lt \'a\'');
  });

  it('lt number, number parameters', () => {
    const p = FilterBuilder.lt(1, 1);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('1 lt 1');
  });
  it('lt Property, number parameters', () => {
    const p = FilterBuilder.lt(FilterBuilder.prop('a'), 1);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a lt 1');
  });

  it('lt boolean, boolean parameters', () => {
    const p = FilterBuilder.lt(true, true);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('true lt true');
  });
  it('lt Property, boolean parameters', () => {
    const p = FilterBuilder.lt(FilterBuilder.prop('a'), false);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a lt false');
  });

  it('lt Date, Date parameters', () => {
    const p = FilterBuilder.lt(dateConstant, dateConstant);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual(dateStringConstant + ' lt ' + dateStringConstant);
  });
  it('lt Property, Date parameters', () => {
    const p = FilterBuilder.lt(FilterBuilder.prop('a'), dateConstant);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a lt ' + dateStringConstant);
  });
  // #endregion

  // #region method : le
  it('le string, string parameters', () => {
    const p = FilterBuilder.le('a', 'a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('\'a\' le \'a\'');
  });
  it('le Property, string parameters', () => {
    const p = FilterBuilder.le(FilterBuilder.prop('a'), 'a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a le \'a\'');
  });

  it('le number, number parameters', () => {
    const p = FilterBuilder.le(1, 1);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('1 le 1');
  });
  it('le Property, number parameters', () => {
    const p = FilterBuilder.le(FilterBuilder.prop('a'), 1);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a le 1');
  });

  it('le boolean, boolean parameters', () => {
    const p = FilterBuilder.le(true, true);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('true le true');
  });
  it('le Property, boolean parameters', () => {
    const p = FilterBuilder.le(FilterBuilder.prop('a'), false);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a le false');
  });

  it('le Date, Date parameters', () => {
    const p = FilterBuilder.le(dateConstant, dateConstant);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual(dateStringConstant + ' le ' + dateStringConstant);
  });
  it('le Property, Date parameters', () => {
    const p = FilterBuilder.le(FilterBuilder.prop('a'), dateConstant);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('a le ' + dateStringConstant);
  });
  // #endregion

  // #region method : inList
  it('inList Property, empty array parameters', () => {
    const p = FilterBuilder.inList(FilterBuilder.prop('a'), []);
    expect(p).toBeNull();
  });

  it('inList Property, one number item array parameters', () => {
    const p = FilterBuilder.inList(FilterBuilder.prop('a'), [1]);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p!.text).toEqual('a in (1)');
  });
  it('inList Property, two number items array parameters', () => {
    const p = FilterBuilder.inList(FilterBuilder.prop('a'), [1, 2]);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p!.text).toEqual('a in (1,2)');
  });
  it('inList Property, three number items array parameters', () => {
    const p = FilterBuilder.inList(FilterBuilder.prop('a'), [1, 2, 3]);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p!.text).toEqual('a in (1,2,3)');
  });

  it('inList Property, one string item array parameters', () => {
    const p = FilterBuilder.inList(FilterBuilder.prop('a'), ['1']);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p!.text).toEqual('a in (\'1\')');
  });
  it('inList Property, two string items array parameters', () => {
    const p = FilterBuilder.inList(FilterBuilder.prop('a'), ['1', '2']);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p!.text).toEqual('a in (\'1\',\'2\')');
  });
  it('inList Property, three string items array parameters', () => {
    const p = FilterBuilder.inList(FilterBuilder.prop('a'), ['1', '2', '3']);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p!.text).toEqual('a in (\'1\',\'2\',\'3\')');
  });

  it('inList Property, one boolean item array parameters', () => {
    const p = FilterBuilder.inList(FilterBuilder.prop('a'), [true]);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p!.text).toEqual('a in (true)');
  });
  it('inList Property, two boolean items array parameters', () => {
    const p = FilterBuilder.inList(FilterBuilder.prop('a'), [true, false]);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p!.text).toEqual('a in (true,false)');
  });

  it('inList Property, one date item array parameters', () => {
    const p = FilterBuilder.inList(FilterBuilder.prop('a'), [dateConstant]);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p!.text).toEqual('a in (' + dateStringConstant + ')');
  });
  it('inList Property, two date items array parameters', () => {
    const p = FilterBuilder.inList(FilterBuilder.prop('a'), [dateConstant, dateConstant2]);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p!.text).toEqual(`a in (${dateStringConstant},${dateStringConstant2})`);
  });
  it('inList Property, three date items array parameters', () => {
    const p = FilterBuilder.inList(FilterBuilder.prop('a'), [dateConstant, dateConstant2, dateConstant3]);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p!.text).toEqual(`a in (${dateStringConstant},${dateStringConstant2},${dateStringConstant3})`);
  });

  // #endregion

  // #region method : and
  it('and Expression, Expression parameters', () => {
    const p = FilterBuilder.and(
      FilterBuilder.equals(FilterBuilder.prop('id'), 5),
      FilterBuilder.equals(FilterBuilder.prop('name'), 'asd'));
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('id eq 5 and name eq \'asd\'');
  });
  // #endregion

  // #region method : or
  it('or Expression, Expression parameters', () => {
    const p = FilterBuilder.or(
      FilterBuilder.equals(FilterBuilder.prop('id'), 5),
      FilterBuilder.equals(FilterBuilder.prop('name'), 'asd'));
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('id eq 5 or name eq \'asd\'');
  });
  // #endregion

  // #region method : not
  it('not Expression parameter', () => {
    const p = FilterBuilder.not(
      FilterBuilder.equals(FilterBuilder.prop('id'), 5));
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('not(id eq 5)');
  });
  it('not Expression parameter with group', () => {
    const p = FilterBuilder.not(
      FilterBuilder.group(
        FilterBuilder.equals(FilterBuilder.prop('id'), 5)));
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('not(id eq 5)');
  });
  // #endregion

  // #region method : group
  it('group Expression parameter ', () => {
    const p = FilterBuilder.group(
      FilterBuilder.equals(FilterBuilder.prop('id'), 5));
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('(id eq 5)');
  });
  // #endregion

  // #region method : contains
  it('contains Expression parameter ', () => {
    const p = FilterBuilder.contains(FilterBuilder.prop('name'), 'a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('contains(name,\'a\')');
  });
  // #endregion

  // #region method : startswith
  it('startswith Expression parameter ', () => {
    const p = FilterBuilder.startswith(FilterBuilder.prop('name'), 'a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('startswith(name,\'a\')');
  });
  // #endregion

  // #region method : endswith
  it('endswith Expression parameter ', () => {
    const p = FilterBuilder.endswith(FilterBuilder.prop('name'), 'a');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.text).toEqual('endswith(name,\'a\')');
  });
  // #endregion
});
