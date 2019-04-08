import { GroupByBuilder, ODataQueryBuilder, OperatorsEnum, Expression, FilterBuilder } from "../../libs";

const odataQueryBuilder = new ODataQueryBuilder('category');
const odataQueryBuilderWithFilter = new ODataQueryBuilder('category').addFilters(FilterBuilder.equals(FilterBuilder.prop('groupId'), 5));

describe('GroupByBuilder tests', () => {
  // #region method : constructor
  it('constructor one ODataQueryBuilder parameter', () => {
    const p = new GroupByBuilder(odataQueryBuilder);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
  });
  // #endregion constructor

  // #region method : isEmpty
  it('isEmpty with true result', () => {
    const p = new GroupByBuilder(odataQueryBuilder);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.isEmpty).toBe(true);
  });
  it('isEmpty with false result', () => {
    const p = new GroupByBuilder(odataQueryBuilder);
    p.addColumn('name');
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.isEmpty).toBe(false);
  });
  // #endregion isEmpty

  // #region method : havingString
  it('havingString with empty string result', () => {
    const p = new GroupByBuilder(odataQueryBuilder);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.havingString).toEqual(String());
  });
  // #endregion havingString


  // #region method : clone
  it('clone with new odataQueryBuilder', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumn('category/id');
    gbb.addCountColumn('count');

    const odqb = new ODataQueryBuilder("product");
    const r = gbb.clone(odqb);
    const p: any = r;

    expect(r).not.toBeNull();
    expect(r).not.toBeUndefined();
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.havingString).toEqual(gbb.havingString);
    expect(p._columns).toEqual((gbb as any)._columns);
    expect(p._aggregates).toEqual((gbb as any)._aggregates);
    expect(p._havings).toEqual((gbb as any)._havings);
  });
  // #endregion havingString


  // #region method : addColumn
  it('addColumn with empty string parameter', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumn('');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(0);
  });
  it('addColumn with whitespaced string parameter', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumn(' ');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(0);
  });
  it('addColumn with one non-empty string parameter', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumn('name');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(1);
    expect(p._columns[0]).toEqual('name');
  });
  it('addColumn with one non-empty whitespaced string parameter', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumn(' name ');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(1);
    expect(p._columns[0]).toEqual('name');
  });
  it('addColumn with one non-empty whitespaced and comma seperated string parameter', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumn(' id ,      name  ');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(2);
    expect(p._columns[0]).toEqual('id');
    expect(p._columns[1]).toEqual('name');
  });
  // #endregion addColumn

  // #region method : addColumns
  it('addColumns without parameter', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumns();
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(0);
  });
  it('addColumns with empty string parameter', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumns('');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(0);
  });
  it('addColumns with two empty string parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumns('', '');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(0);
  });
  it('addColumns with whitespaced string parameter', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumns(' ');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(0);
  });
  it('addColumns with two whitespaced string parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumns(' ', ' ');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(0);
  });
  it('addColumns with one non-empty string parameter', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumns('name');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(1);
    expect(p._columns[0]).toEqual('name');
  });
  it('addColumns with one empty and one non-empty string parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumns('', 'name');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(1);
    expect(p._columns[0]).toEqual('name');
  });
  it('addColumns with one non-empty whitespaced string parameter', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumns(' name ');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(1);
    expect(p._columns[0]).toEqual('name');
  });
  it('addColumns with one whitespaced and one non-empty whitespaced string parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumns(' ', ' name ');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(1);
    expect(p._columns[0]).toEqual('name');
  });
  it('addColumns with one non-empty whitespaced and comma seperated string parameter', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumns(' id ,      name  ');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(2);
    expect(p._columns[0]).toEqual('id');
    expect(p._columns[1]).toEqual('name');
  });

  it('addColumns with two non-empty whitespaced string parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumns(' id ', '      name  ');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._columns).not.toBeNull();
    expect(p._columns).not.toBeUndefined();
    expect(p._columns.length).not.toBeNull();
    expect(p._columns.length).not.toBeUndefined();
    expect(p._columns.length).toEqual(2);
    expect(p._columns[0]).toEqual('id');
    expect(p._columns[1]).toEqual('name');
  });
  // #endregion addColumns

  // #region method : addSumColumn
  it('addSumColumn with two empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addSumColumn('', '');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(0);
  });
  it('addSumColumn with one empty and one non-empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addSumColumn('', 'a');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(0);
  });
  it('addSumColumn with one non-empty and one empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addSumColumn('a', '');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(0);
  });
  it('addSumColumn with two non-empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addSumColumn('a', 'b');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(1);
    expect(p._aggregates[0]).not.toBeNull();
    expect(p._aggregates[0]).not.toBeUndefined();
    expect(p._aggregates[0].columnOrExpression).toEqual('a');
    expect(p._aggregates[0].operator).toEqual(OperatorsEnum.Sum);
    expect(p._aggregates[0].alias).toEqual('b');
  });
  // #endregion addSumColumn

  // #region method : addMinColumn
  it('addMinColumn with two empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addMinColumn('', '');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(0);
  });
  it('addMinColumn with one empty and one non-empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addMinColumn('', 'a');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(0);
  });
  it('addMinColumn with one non-empty and one empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addMinColumn('a', '');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(0);
  });
  it('addMinColumn with two non-empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addMinColumn('a', 'b');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(1);
    expect(p._aggregates[0]).not.toBeNull();
    expect(p._aggregates[0]).not.toBeUndefined();
    expect(p._aggregates[0].columnOrExpression).toEqual('a');
    expect(p._aggregates[0].operator).toEqual(OperatorsEnum.Min);
    expect(p._aggregates[0].alias).toEqual('b');
  });
  // #endregion addMinColumn

  // #region method : addMaxColumn
  it('addMaxColumn with two empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addMaxColumn('', '');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(0);
  });
  it('addMaxColumn with one empty and one non-empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addMaxColumn('', 'a');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(0);
  });
  it('addMaxColumn with one non-empty and one empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addMaxColumn('a', '');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(0);
  });
  it('addMaxColumn with two non-empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addMaxColumn('a', 'b');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(1);
    expect(p._aggregates[0]).not.toBeNull();
    expect(p._aggregates[0]).not.toBeUndefined();
    expect(p._aggregates[0].columnOrExpression).toEqual('a');
    expect(p._aggregates[0].operator).toEqual(OperatorsEnum.Max);
    expect(p._aggregates[0].alias).toEqual('b');
  });
  // #endregion addMaxColumn

  // #region method : addAverageColumn
  it('addAverageColumn with two empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addAverageColumn('', '');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(0);
  });
  it('addAverageColumn with one empty and one non-empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addAverageColumn('', 'a');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(0);
  });
  it('addAverageColumn with one non-empty and one empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addAverageColumn('a', '');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(0);
  });
  it('addAverageColumn with two non-empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addAverageColumn('a', 'b');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(1);
    expect(p._aggregates[0]).not.toBeNull();
    expect(p._aggregates[0]).not.toBeUndefined();
    expect(p._aggregates[0].columnOrExpression).toEqual('a');
    expect(p._aggregates[0].operator).toEqual(OperatorsEnum.Average);
    expect(p._aggregates[0].alias).toEqual('b');
  });
  // #endregion addAverageColumn

  // #region method : addCountColumn
  it('addCountColumn with two empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addCountColumn('');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(0);
  });
  it('addCountColumn with two non-empty parameters', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addCountColumn('b');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._aggregates).not.toBeNull();
    expect(p._aggregates).not.toBeUndefined();
    expect(p._aggregates.length).not.toBeNull();
    expect(p._aggregates.length).not.toBeUndefined();
    expect(p._aggregates.length).toEqual(1);
    expect(p._aggregates[0]).not.toBeNull();
    expect(p._aggregates[0]).not.toBeUndefined();
    expect(p._aggregates[0].operator).toEqual(OperatorsEnum.Count);
    expect(p._aggregates[0].alias).toEqual('b');
    expect(p._aggregates[0].toString()).toEqual('$count as b');
  });
  // #endregion addCountColumn

  // #region method : addHavings
  it('addHavings with parameterless', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addHavings();
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._havings).not.toBeNull();
    expect(p._havings).not.toBeUndefined();
    expect(p._havings.length).not.toBeNull();
    expect(p._havings.length).not.toBeUndefined();
    expect(p._havings.length).toEqual(0);
  });
  it('addHavings with one string parameter', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addHavings('totalPrice gt 10');
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._havings).not.toBeNull();
    expect(p._havings).not.toBeUndefined();
    expect(p._havings.length).not.toBeNull();
    expect(p._havings.length).not.toBeUndefined();
    expect(p._havings.length).toEqual(1);
    expect(p._havings[0]).toEqual('totalPrice gt 10');
  });
  it('addHavings with one Expression parameter', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addHavings(FilterBuilder.gt(FilterBuilder.prop('totalPrice'), 10));
    const p: any = gbb;
    expect(gbb).not.toBeNull();
    expect(gbb).not.toBeUndefined();
    expect(p._havings).not.toBeNull();
    expect(p._havings).not.toBeUndefined();
    expect(p._havings.length).not.toBeNull();
    expect(p._havings.length).not.toBeUndefined();
    expect(p._havings.length).toEqual(1);
    expect(p._havings[0]).toEqual(new Expression('totalPrice gt 10'));
  });
  // #endregion addHavings

  // #region method : toString
  it('toString with empty result', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    const p = gbb.toString();
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('');
  });
  it('toString with one column result', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumn('name');
    const p = gbb.toString();
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('groupby((name))');
  });
  it('toString with one sum column result', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addSumColumn('price', 'priceTotal');
    const p = gbb.toString();
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('groupby(aggregate(price with sum as priceTotal))');
  });
  it('toString with one column and sum column result', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumn('name');
    gbb.addSumColumn('price', 'priceTotal');
    const p = gbb.toString();
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('groupby((name),aggregate(price with sum as priceTotal))');
  });

  it('toString with one column and min column result', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumn('name');
    gbb.addMinColumn('price', 'minPrice');
    const p = gbb.toString();
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('groupby((name),aggregate(price with min as minPrice))');
  });
  it('toString with one column and max column result', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumn('name');
    gbb.addMaxColumn('price', 'maxPrice');
    const p = gbb.toString();
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('groupby((name),aggregate(price with max as maxPrice))');
  });
  it('toString with one column and average column result', () => {
    const gbb = new GroupByBuilder(odataQueryBuilder);
    gbb.addColumn('name');
    gbb.addAverageColumn('price', 'averagePrice');
    const p = gbb.toString();
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('groupby((name),aggregate(price with average as averagePrice))');
  });

  it('toString with one column and average column and filter result', () => {
    const gbb = new GroupByBuilder(odataQueryBuilderWithFilter);
    gbb.addColumn('name');
    gbb.addAverageColumn('price', 'averagePrice');
    const p = gbb.toString();
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual('filter(groupId eq 5)/groupby((name),aggregate(price with average as averagePrice))');
  });
  // #endregion toString

});
