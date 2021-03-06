import { ODataQueryBuilder, OrderByDirection, prepareFilterString } from '../../libs/odata-query-builder';
import { ODataQuery } from '../../libs/odata-query';
import { Expression, FilterBuilder, Parameter, ExpandBuilder, ConnectionService } from '../../libs';

describe('odata-query-builder tests', () => {
  // #region method : constructor
  it('constructor empty parameter', () => {
    const qb = new ODataQueryBuilder('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.resource).toEqual('');
  });
  it('constructor non-empty parameter', () => {
    const qb = new ODataQueryBuilder('category');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.resource).toEqual('category');
  });
  it('constructor non-empty and connection service parameter', () => {
    const connectionService = new ConnectionService();
    const qb = new ODataQueryBuilder('category', connectionService);
    expect(qb).not.toBeNull();
    expect(qb).not.toBeUndefined();
    expect(qb.resource).toEqual('category');
    expect(qb.connectionService).toEqual(connectionService);
  });
  it('constructor with additionalQueryString parameter', () => {
    const additionalQueryString = { a: 'b' };
    const qb = new ODataQueryBuilder('category', undefined, additionalQueryString);
    const q = qb.getQuery();
    expect(qb).not.toBeNull();
    expect(qb).not.toBeUndefined();
    expect(qb.resource).toEqual('category');
    expect(qb.additionalQueryStrings).toEqual(additionalQueryString);
    expect(q.aditionalQueryStrings).toEqual(additionalQueryString);
    expect((q as any).createRelativeUrl()).toEqual('odata/category?a=b');
  });
  it('constructor with additionalQueryString parameter(two item)', () => {
    const additionalQueryString = { a: 'b', c: '10' };
    const qb = new ODataQueryBuilder('category', undefined, additionalQueryString);
    const q = qb.getQuery();
    expect(qb).not.toBeNull();
    expect(qb).not.toBeUndefined();
    expect(qb.resource).toEqual('category');
    expect(qb.additionalQueryStrings).toEqual(additionalQueryString);
    expect(q.aditionalQueryStrings).toEqual(additionalQueryString);
    expect((q as any).createRelativeUrl()).toEqual('odata/category?a=b&c=10');
  });
  // #endregion

  // #region method : clone
  it('clone', () => {
    const qb = new ODataQueryBuilder('category');
    qb.setApiVersion('1.0');
    qb.addColumn('id,name');
    const r = qb.clone();
    expect(r).not.toBeNull();
    expect(r).not.toBeUndefined();
    expect(r).not.toBe(qb);
    expect(r).toEqual(qb);
  });
  it('clone with group by', () => {
    const qb = new ODataQueryBuilder('category');
    qb.setApiVersion('1.0');
    qb.groupBy.addColumn('name');
    const r = qb.clone();
    expect(r).not.toBeNull();
    expect(r).not.toBeUndefined();
    expect(r).not.toBe(qb);
    expect(r).toEqual(qb);
  });
  // #endregion

  // #region method : apiVersion
  it('apiVersion non-empty parameter', () => {
    const qb = new ODataQueryBuilder('category');
    qb.setApiVersion('1.0');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.apiVersion).toEqual('1.0');
  });
  it('apiVersion empty after non-empty parameter', () => {
    const qb = new ODataQueryBuilder('category');
    qb.setApiVersion('1.0');
    qb.setApiVersion(null);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.apiVersion).toBeNull();
  });
  it('apiVersion non-empty parameter on query', () => {
    const qb = new ODataQueryBuilder('category');
    qb.setApiVersion('1.0');
    const p: any = qb.getQuery();
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('api-version=1.0');
  });
  // #endregion

  // #region method : addColumn
  it('addColumn one empty parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumn('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addColumn one non-empty parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumn('id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual(['id']);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').select('id'));
  });
  it('addColumn one non-empty parameter which has two column names with comma seperated', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumn('id,name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual(['id', 'name']);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').select('id,name'));
  });
  it('addColumn one non-empty parameter which has two column names with comma seperated and non-trimmed', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumn(' id , name ');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual(['id', 'name']);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').select('id,name'));
  });
  it('addColumn one non-empty parameter which has two column(empty and non-empty) names with comma seperated and non-trimmed',
    () => {
      const qb = new ODataQueryBuilder('category')
        .addColumn('  , name ');
      const p: any = qb;
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.columns).toEqual(['name']);

      const q = qb.getQuery();
      expect(q).not.toBeNull();
      expect(q).not.toBeUndefined();
      expect(q).toEqual(new ODataQuery('category').select('name'));
    });
  // #endregion

  // #region method : addColumns
  it('addColumns parameterless', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumns();
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);
    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addColumns one empty parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumns('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addColumns one non-empty parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumns('id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual(['id']);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').select('id'));
  });

  it('addColumns two empty parameters', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumns('', '');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addColumns two (empty and non-empty) parameters', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumns('', 'name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual(['name']);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').select('name'));
  });
  it('addColumns two non-empty parameters', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumns('id', 'name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual(['id', 'name']);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').select('id,name'));
  });
  it('addColumns two non-empty parameters which are seperated with comma', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumns('id,name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual(['id', 'name']);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').select('id,name'));
  });
  it('addColumns two non-empty parameters which are seperated with comma and non-trimmed', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumns(' id , name ');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual(['id', 'name']);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').select('id,name'));
  });
  // #endregion

  // #region method : removeColumns
  it('removeColumns parameterless', () => {
    const qb = new ODataQueryBuilder('category')
      .removeColumns();
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('removeColumns one empty parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .removeColumns('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('removeColumns one non-empty parameter with empty column list', () => {
    const qb = new ODataQueryBuilder('category')
      .removeColumns('id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('removeColumns one non-empty parameter with non-empty column list', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumns('id', 'name')
      .removeColumns('id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual(['name']);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').select('name'));
  });
  it('removeColumns one non-empty parameter with non-empty column list 2', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumns('id', 'name')
      .removeColumns('id', 'id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual(['name']);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').select('name'));
  });
  it('removeColumns one non-empty parameter with non-empty column list', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumns('id', 'name', 'title')
      .removeColumns('id', 'name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual(['title']);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').select('title'));
  });
  // #endregion

  // #region method : clearColumns
  it('clearColumns parameterless', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumns('id', 'name')
      .clearColumns();
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  // #endregion

  // #region method : addExpandColumns
  it('addExpandColumns parameterless', () => {
    const qb = new ODataQueryBuilder('category')
      .addExpandColumns();
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addExpandColumns one non-expandable parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addExpandColumns('id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').select('id'));
  });
  it('addExpandColumns one expandable parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addExpandColumns('products.id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').expand('products($select=id)'));
  });
  it('addExpandColumns one expandable parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addExpandColumns('products.category.id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').expand('products($expand=category($select=id))'));
  });
  it('addExpandColumns two expandable parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addExpandColumns('products.id', 'products.name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').expand('products($select=id,name)'));
  });
  // #endregion

  // #region method : addExpand
  it('addExpand parameterless', () => {
    const qb = new ODataQueryBuilder('category')
      .addExpand();
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addExpand one expandable parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addExpand(new ExpandBuilder('products').addColumn('id'));
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').expand('products($select=id)'));
  });
  it('addExpand one expandable parameter 2', () => {
    const qb = new ODataQueryBuilder('category')
      .addExpand(new ExpandBuilder('products').addExpandFromString('products.category.id'));
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').expand('products($expand=category($select=id))'));
  });
  it('addExpand two expandable parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addExpand(new ExpandBuilder('products').addColumn('id'), new ExpandBuilder('group').addColumn('name'));
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').expand('products($select=id),group($select=name)'));
  });
  // #endregion

  // #region method : addFilters
  it('addFilters parameterless', () => {
    const qb = new ODataQueryBuilder('category')
      .addFilters();
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addFilters one empty string parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addFilters('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addFilters one empty Expression parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addFilters(new Expression(''));
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  // addFilters null bir değer kabul etmemekte. o yüzden burayı yorum haline getirdim.
  // it('addFilters one null parameter', () => {
  //   const qb = new ODataQueryBuilder('category')
  //     .addFilters(null);
  //   const p: any = qb;
  //   expect(p).not.toBeNull();
  //   expect(p).not.toBeUndefined();
  //   expect(p.expands).not.toBeNull();

  //   const q = qb.getQuery();
  //   expect(q).not.toBeNull();
  //   expect(q).not.toBeUndefined();
  //   expect(q).toEqual(new ODataQuery('category'));
  // });
  it('addFilters two empty string parameters', () => {
    const qb = new ODataQueryBuilder('category')
      .addFilters('', '');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addFilters two empty Expression parameters', () => {
    const qb = new ODataQueryBuilder('category')
      .addFilters(new Expression(''), new Expression(''));
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  // addFilters null bir değer kabul etmemekte. o yüzden burayı yorum haline getirdim.
  // it('addFilters two null parameters', () => {
  //   const qb = new ODataQueryBuilder('category')
  //     .addFilters(null, null);
  //   const p: any = qb;
  //   expect(p).not.toBeNull();
  //   expect(p).not.toBeUndefined();
  //   expect(p.expands).not.toBeNull();

  //   const q = qb.getQuery();
  //   expect(q).not.toBeNull();
  //   expect(q).not.toBeUndefined();
  //   expect(q).toEqual(new ODataQuery('category'));
  // });
  // it('addFilters one empty string and one null parameters', () => {
  //   const qb = new ODataQueryBuilder('category')
  //     .addFilters('', null);
  //   const p: any = qb;
  //   expect(p).not.toBeNull();
  //   expect(p).not.toBeUndefined();
  //   expect(p.expands).not.toBeNull();

  //   const q = qb.getQuery();
  //   expect(q).not.toBeNull();
  //   expect(q).not.toBeUndefined();
  //   expect(q).toEqual(new ODataQuery('category'));
  // });
  it('addFilters one non-empty string parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addFilters('id eq 5');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').filter('id eq 5'));
  });
  it('addFilters two non-empty string parameters', () => {
    const qb = new ODataQueryBuilder('category')
      .addFilters('id eq 5', 'name eq \'John\'');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').filter('id eq 5', 'name eq \'John\''));
  });
  it('addFilters one empty, two non-empty string parameters', () => {
    const qb = new ODataQueryBuilder('category')
      .addFilters('', 'id eq 5', 'name eq \'John\'');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').filter('id eq 5', 'name eq \'John\''));
  });
  it('addFilters one non-empty Expression parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addFilters(new Expression('id eq 5'));
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').filter('id eq 5'));
  });
  it('addFilters one non-empty Expression parameter with FilterBuilder', () => {
    const qb = new ODataQueryBuilder('category')
      .addFilters(FilterBuilder.equals(FilterBuilder.prop('id'), 5));
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').filter('id eq 5'));
  });
  it('addFilters two non-empty Expression parameters', () => {
    const qb = new ODataQueryBuilder('category')
      .addFilters(new Expression('id eq 5'), new Expression('name eq \'John\''));
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').filter('id eq 5', 'name eq \'John\''));
  });
  it('addFilters two non-empty Expression parameters with FilterBuilder', () => {
    const qb = new ODataQueryBuilder('category')
      .addFilters(FilterBuilder.equals(FilterBuilder.prop('id'), 5),
        FilterBuilder.equals(FilterBuilder.prop('name'), 'John'));
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').filter('id eq 5', 'name eq \'John\''));
  });
  // #endregion

  // #region method : clearFilters
  it('clearFilters parameterless', () => {
    const qb = new ODataQueryBuilder('category')
      .addFilters('id eq 5')
      .clearFilters();
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  // #endregion

  // #region method : prepareFilterString
  it('prepareFilterString one number array parameter', () => {
    const p = prepareFilterString([1, 2, 3]);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual(String());
  });
  // #endregion prepareFilterString

  // #region method : addOrderBy
  it('addOrderBy one empty parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderBy('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addOrderBy one empty parameter 2', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderBy(' ');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addOrderBy one empty parameter with desc', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderBy('', OrderByDirection.Desc);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addOrderBy one empty parameter with desc 2', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderBy(' ', OrderByDirection.Desc);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addOrderBy one non-empty string parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderBy('id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').orderBy('id'));
  });
  it('addOrderBy one non-empty string parameter with desc', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderBy('id', OrderByDirection.Desc);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').orderBy('id desc'));
  });
  it('addOrderBy multiple call with one non-empty string parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderBy('id')
      .addOrderBy('name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').orderBy('id', 'name'));
  });
  // #endregion

  // #region method : addOrderByDesc
  it('addOrderByDesc one empty parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderByDesc('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addOrderByDesc one empty parameter 2', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderByDesc(' ');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addOrderByDesc one non-empty string parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderByDesc('id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').orderBy('id desc'));
  });
  it('addOrderByDesc multiple call with one non-empty string parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderByDesc('id')
      .addOrderByDesc('name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').orderBy('id desc', 'name desc'));
  });
  // #endregion

  // #region method : addOrderByDesc
  it('addOrderByList parameterless', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderByList();
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addOrderByList one empty parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderByList('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addOrderByList one empty parameter2', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderByList(',');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addOrderByList two empty parameters', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderByList('', '');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  it('addOrderByList one non-empty parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderByList('id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').orderBy('id'));
  });
  it('addOrderByList two non-empty parameters', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderByList('id', 'name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').orderBy('id', 'name'));
  });
  it('addOrderByList two non-empty parameters 2', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderByList('id desc', 'name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').orderBy('id desc', 'name'));
  });

  it('addOrderByList one non-empty parameter with comma seperated', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderByList('id desc,name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').orderBy('id desc', 'name'));
  });
  it('addOrderByList one non-empty parameter with comma seperated 2', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderByList(' id desc , name ');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').orderBy('id desc', 'name'));
  });
  // #endregion


  // #region method : clearOrderByList
  it('clearOrderByList parameterless', () => {
    const qb = new ODataQueryBuilder('category')
      .addOrderBy('id')
      .addOrderByDesc('name')
      .clearOrderByList();
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  // #endregion

  // #region method : top
  it('top one parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .setTop(5);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').top(5));
  });
  // #endregion

  // #region method : skip
  it('skip one parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .setSkip(5);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').skip(5));
  });
  // #endregion

  // #region method : addParameter
  it('addParameter one property parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addParameter(new Parameter('id', 5));
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').parameters('@id=5'));
  });
  it('addParameter two parameters', () => {
    const qb = new ODataQueryBuilder('category')
      .addParameter('a', 'asd');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').parameters('@a=\'asd\''));
  });
  it('addParameter two parameters', () => {
    const qb = new ODataQueryBuilder('category')
      .addParameter('id', 5)
      .addParameter('name', 'asd');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').parameters('@id=5', '@name=\'asd\''));
  });
  // #endregion

  // #region method : addParameters
  it('addParameters one parameter parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addParameters(new Parameter('name', 'asd'));
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').parameters('@name=\'asd\''));
  });
  it('addParameters one object parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addParameters({ 'name': new Parameter('name', 'asd') });
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').parameters('@name=\'asd\''));
  });
  it('addParameters two parameters', () => {
    const qb = new ODataQueryBuilder('category')
      .addParameters({ 'id': new Parameter('id', 5), 'name': new Parameter('name', 'asd') });
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').parameters('@id=5', '@name=\'asd\''));
  });
  it('addParameters one property parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addParameters([new Parameter('name', 'asd')]);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').parameters('@name=\'asd\''));
  });
  it('addParameters two parameter parameters', () => {
    const qb = new ODataQueryBuilder('category')
      .addParameters([new Parameter('id', 5), new Parameter('name', 'asd')]);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').parameters('@id=5', '@name=\'asd\''));
  });
  // #endregion

  // #region method : clearParameters
  it('clearParameters parameterless', () => {
    const qb = new ODataQueryBuilder('category')
      .addParameters({ 'name': new Parameter('name', 'asd') })
      .clearParameters();
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  // #endregion clearParameters


  // #region method : removeParameter
  it('removeParameter one parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addParameters([new Parameter('id', 5), new Parameter('name', 'asd')])
      .removeParameter('id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').parameters('@name=\'asd\''));
  });
  it('removeParameter one not exists parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addParameters([new Parameter('id', 5), new Parameter('name', 'asd')])
      .removeParameter('id2');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').parameters('@id=5', '@name=\'asd\''));
  });
  // #endregion removeParameter

  // #region method : groupBy
  it('groupBy one parameter', () => {
    const qb = new ODataQueryBuilder('category');
    qb.groupBy.addColumn('name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').groupBy('(name)'));
  });
  it('groupBy two parameter', () => {
    const qb = new ODataQueryBuilder('category');
    qb.groupBy.addColumn('name');
    qb.groupBy.addColumn('id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').groupBy('(name,id)'));
  });

  it('groupBy two parameter with having', () => {
    const qb = new ODataQueryBuilder('category');
    qb.groupBy.addColumn('name');
    qb.groupBy.addColumn('id');
    qb.groupBy.addSumColumn('price', 'totalPrice');
    qb.groupBy.addHavings('totalPrice gt 10');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').groupBy('(name,id),aggregate(price with sum as totalPrice)').filter('totalPrice gt 10'));
  });
  // #endregion groupBy

  // #region method : getQuery
  it('getQuery one number array parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .setAllPagesRowCount();
    const p = qb.getQuery();
    expect(qb).not.toBeNull();
    expect(qb).not.toBeUndefined();
    expect((qb as any).getAllPagesRowCount).toEqual(true);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual(new ODataQuery('category').allPagesRowCount(true));
  });

  it('getQuery one number array parameter 2', () => {
    const qb = new ODataQueryBuilder('category')
      .setAllPagesRowCount(true);
    const p = qb.getQuery();
    expect(qb).not.toBeNull();
    expect(qb).not.toBeUndefined();
    expect((qb as any).getAllPagesRowCount).toEqual(true);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual(new ODataQuery('category').allPagesRowCount(true));
  });

  it('getQuery one number array parameter 3', () => {
    const qb = new ODataQueryBuilder('category')
      .setAllPagesRowCount(true)
      .setAllPagesRowCount(false);
    const p = qb.getQuery();
    expect(qb).not.toBeNull();
    expect(qb).not.toBeUndefined();
    expect((qb as any).getAllPagesRowCount).toEqual(false);
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p).toEqual(new ODataQuery('category').allPagesRowCount(false));
  });
  // #endregion getQuery

});
