import { ODataQueryBuilder } from '../../libs/odata-query-builder';
import { ODataQuery } from '../../libs/odata-query';

describe('odata-query-builder tests', () => {
  // #region method : constructor
  it('constructor empty parameter', () => {
    const qb = new ODataQueryBuilder('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._resource).toEqual('');
  });
  it('constructor non-empty parameter', () => {
    const qb = new ODataQueryBuilder('category');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._resource).toEqual('category');
  });
  // #endregion

  // #region method : apiVersion
  it('apiVersion non-empty parameter', () => {
    const qb = new ODataQueryBuilder('category');
    qb.apiVersion('1.0');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._apiVersion).toEqual('1.0');
  });
  it('apiVersion empty after non-empty parameter', () => {
    const qb = new ODataQueryBuilder('category');
    qb.apiVersion('1.0');
    qb.apiVersion(null);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._apiVersion).toBeNull();
  });
  // #endregion

  // #region method : addColumn
  it('addColumn one empty parameter', () => {
    const qb = new ODataQueryBuilder('category')
      .addColumn('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._columns).toEqual([]);

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
    expect(p._columns).toEqual(['id']);

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
    expect(p._columns).toEqual(['id', 'name']);

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
    expect(p._columns).toEqual(['id', 'name']);

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
    expect(p._columns).toEqual(['name']);

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
    expect(p._columns).toEqual([]);
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
    expect(p._columns).toEqual([]);

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
    expect(p._columns).toEqual(['id']);

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
    expect(p._columns).toEqual([]);

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
    expect(p._columns).toEqual(['name']);

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
    expect(p._columns).toEqual(['id', 'name']);

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
    expect(p._columns).toEqual(['id', 'name']);

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
    expect(p._columns).toEqual(['id', 'name']);

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
    expect(p._columns).toEqual([]);

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
    expect(p._columns).toEqual([]);

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
    expect(p._columns).toEqual([]);

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
    expect(p._columns).toEqual(['name']);

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
    expect(p._columns).toEqual(['name']);

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
    expect(p._columns).toEqual(['title']);

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
    expect(p._columns).toEqual([]);

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category'));
  });
  // #endregion

  // #region method : addExpandColumns
  it('addExpandColumns parameterless', () => {
    const qb = new ODataQueryBuilder('category')
      .addExpandColumns('products.id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._expands).not.toBeNull();

    const q = qb.getQuery();
    expect(q).not.toBeNull();
    expect(q).not.toBeUndefined();
    expect(q).toEqual(new ODataQuery('category').expand('products($select=id)'));
  });
  // #endregion



});
