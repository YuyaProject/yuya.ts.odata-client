import { ODataQuery, canQuery, ConnectionService, ExpandBuilder, IConnectionService } from '../../libs';
import sinon from 'sinon';

describe('odata-query tests', () => {
  // #region method : canQuery
  it('constructor non-query parameter', () => {
    const p = canQuery('');
    expect(p).toBe(false);
  });
  it('constructor query parameter', () => {
    const p = canQuery(new ODataQuery('a'));
    expect(p).toBe(true);
  });
  // #endregion

  // #region method : constructor
  it('constructor empty parameter', () => {
    const qb = new ODataQuery('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._resource).toEqual('');
  });
  it('constructor non-empty parameter', () => {
    const qb = new ODataQuery('category');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._resource).toEqual('category');
  });
  it('constructor non-empty and connection service parameter', () => {
    const qb = new ODataQuery('category', new ConnectionService());
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._resource).toEqual('category');
  });
  // #endregion

  // #region method : apiVersion
  it('apiVersion non-empty parameter on query', () => {
    const qb = new ODataQuery('category');
    qb.apiVersion('1.0');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('api-version=1.0');
  });
  // #endregion

  // #region method : filter
  it('filter parameterless', () => {
    const qb = new ODataQuery('category').filter();
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(0);
  });
  it('filter one empty string parameter', () => {
    const qb = new ODataQuery('category').filter('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(0);
  });
  it('filter two empty string parameters', () => {
    const qb = new ODataQuery('category').filter('', '');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(0);
  });
  it('filter one non-empty string parameter', () => {
    const qb = new ODataQuery('category').filter('id eq 5');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$filter=id eq 5');
  });
  it('filter two non-empty string parameters', () => {
    const qb = new ODataQuery('category').filter('id eq 5', 'name eq \'John\'');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$filter=id eq 5 and name eq \'John\'');
  });
  it('filter one empty, two non-empty string parameters', () => {
    const qb = new ODataQuery('category').filter('', 'id eq 5', 'name eq \'John\'');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$filter=id eq 5 and name eq \'John\'');
  });
  it('filter non-empty string parameter and multiple calls', () => {
    const qb = new ODataQuery('category').filter('id eq 5').filter('name eq \'John\'');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$filter=(id eq 5)and(name eq \'John\')');
  });
  // #endregion filter

  // #region method : orderBy
  it('orderBy one empty parameter', () => {
    const qb = new ODataQuery('category').orderBy('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(0);
  });
  it('orderBy one empty parameter 2', () => {
    const qb = new ODataQuery('category').orderBy(' ');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(0);
  });
  it('orderBy one non-empty string parameter', () => {
    const qb = new ODataQuery('category').orderBy('id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$orderby=id');
  });
  it('orderBy one non-empty string parameter with desc', () => {
    const qb = new ODataQuery('category').orderBy('id desc');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$orderby=id desc');
  });
  it('orderBy one non-empty two string parameter', () => {
    const qb = new ODataQuery('category').orderBy('id,name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$orderby=id,name');
  });
  it('orderBy one non-empty two string parameter with whitespaces', () => {
    const qb = new ODataQuery('category').orderBy(' id , name ');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$orderby=id,name');
  });
  it('orderBy multiple call with one non-empty string parameter', () => {
    const qb = new ODataQuery('category')
      .orderBy('id')
      .orderBy('name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$orderby=id,name');
  });
  it('orderBy multiple call with one non-empty white-spaced string parameter', () => {
    const qb = new ODataQuery('category')
      .orderBy(' id ')
      .orderBy(' name ');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$orderby=id,name');
  });
  // #endregion


  // #region method : top
  it('top one parameter', () => {
    const qb = new ODataQuery('category').top(5);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$top=5');
  });
  // #endregion

  // #region method : skip
  it('skip one parameter', () => {
    const qb = new ODataQuery('category').skip(5);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$skip=5');
  });
  // #endregion


  // #region method : expand
  it('expand one expandbuilder parameter', () => {
    const qb = new ODataQuery('category').expand(new ExpandBuilder('a'));
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$expand=a');
  });
  // #endregion


  // #region method : hasExpand
  it('hasExpand for true value', () => {
    const qb = new ODataQuery('category').expand(new ExpandBuilder('a'));
    const p: boolean = qb.hasExpand();
    expect(p).toBe(true);
  });
  it('hasExpand for false value', () => {
    const qb = new ODataQuery('category');
    const p: boolean = qb.hasExpand();
    expect(p).toBe(false);
  });
  // #endregion


  // #region method : parameter
  it('parameter number value parameter', () => {
    const qb = new ODataQuery('category').parameter('id', 5);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('@id=5');
  });
  it('parameter string value parameters', () => {
    const qb = new ODataQuery('category').parameter('a', 'asd');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('@a=\'asd\'');
  });
  it('parameter two parameters and multiple call', () => {
    const qb = new ODataQuery('category')
      .parameter('id', 5)
      .parameter('name', 'asd');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(2);
    expect(p._queryStrings[0]).toEqual('@id=5');
    expect(p._queryStrings[1]).toEqual('@name=\'asd\'');
  });
  // #endregion parameter

  // #region method : parameters
  it('parameters one string parameter', () => {
    const qb = new ODataQuery('category').parameters('@id=5');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('@id=5');
  });
  it('parameters two string parameters', () => {
    const qb = new ODataQuery('category').parameters('@id=5', '@name=\'asd\'');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(2);
    expect(p._queryStrings[0]).toEqual('@id=5');
    expect(p._queryStrings[1]).toEqual('@name=\'asd\'');
  });
  // #endregion

  // #region method : allPagesRowCount
  it('allPagesRowCount empty parameter', () => {
    const qb = new ODataQuery('category').allPagesRowCount();
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._getAllPagesRowCount).toBe(true);
  });
  it('allPagesRowCount true parameter', () => {
    const qb = new ODataQuery('category').allPagesRowCount(true);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._getAllPagesRowCount).toBe(true);
  });
  it('allPagesRowCount false parameter', () => {
    const qb = new ODataQuery('category').allPagesRowCount(false);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._getAllPagesRowCount).toBe(false);
  });
  // #endregion

  // #region method : groupBy
  it('groupBy empty string parameter', () => {
    const qb = new ODataQuery('category').groupBy('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(0);
  });
  it('groupBy whitespaced string parameter', () => {
    const qb = new ODataQuery('category').groupBy(' ');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(0);
  });
  it('groupBy string parameter', () => {
    const qb = new ODataQuery('category').groupBy('(name)');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$apply=groupby((name))');
  });
  it('groupBy string parameter with dot', () => {
    const qb = new ODataQuery('category').groupBy('(products.name)');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$apply=groupby((products/name))');
  });
  // #endregion groupBy

  // #region method : apply
  it('apply empty string parameter', () => {
    const qb = new ODataQuery('category').apply('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(0);
  });
  it('apply whitespaced string parameter', () => {
    const qb = new ODataQuery('category').apply(' ');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(0);
  });
  it('apply string parameter', () => {
    const qb = new ODataQuery('category').apply('groupby((name))');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$apply=groupby((name))');
  });
  it('apply string parameter with dot', () => {
    const qb = new ODataQuery('category').apply('groupby((products.name))');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p._queryStrings).not.toBeNull();
    expect(p._queryStrings).not.toBeUndefined();
    expect(p._queryStrings.length).toEqual(1);
    expect(p._queryStrings[0]).toEqual('$apply=groupby((products/name))');
  });
  // #endregion apply



  // #region method : q
  it('q parameterless', async () => {
    const returnObject = { id: 1 };
    const baseConnectionService = new ConnectionService();
    const stubRequest = sinon.stub(baseConnectionService, 'request')
      .returns(new Promise<any>(resolve => { resolve(returnObject); }));
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.q();
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p).toEqual(returnObject);
      expect(stubRequest.called).toBe(true);
    }
    finally {
      stubRequest.restore();
    }
  });
  it('q parameterless with filter', async () => {
    const returnObject = { id: 1 };
    const baseConnectionService = new ConnectionService();
    const stubRequest = sinon.stub(baseConnectionService, 'request')
      .returns(new Promise<any>(resolve => { resolve(returnObject); }));
    try {
      const qb = new ODataQuery('category', baseConnectionService).filter('id eq 1');

      const p = await qb.q();
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p).toEqual(returnObject);
      expect(stubRequest.called).toBe(true);
    }
    finally {
      stubRequest.restore();
    }
  });

  it('q parameterless with filter and rowcount', async () => {
    const returnObject = { id: 1 };
    const baseConnectionService = new ConnectionService();
    const stubRequest = sinon.stub(baseConnectionService, 'request')
      .returns(new Promise<any>(resolve => { resolve(returnObject); }));
    try {
      const qb = new ODataQuery('category', baseConnectionService).filter('id eq 1').allPagesRowCount();

      const p = await qb.q();
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p).toEqual(returnObject);
      expect(stubRequest.called).toBe(true);
    }
    finally {
      stubRequest.restore();
    }
  });
  // #endregion q



  // #region method : count
  it('count parameterless', async () => {
    const returnNumber = 5;
    const baseConnectionService = new ConnectionService();
    const stubRequest = sinon.stub(baseConnectionService, 'requestT')
      .returns(new Promise<number>(resolve => { resolve(returnNumber); }));
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.count();
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p).toEqual(returnNumber);
      expect(stubRequest.called).toBe(true);
    }
    finally {
      stubRequest.restore();
    }
  });
  // #endregion count


  // #region method : getByKey
  it('getByKey one parameter', async () => {
    const returnObject = { id: 5 };
    const baseConnectionService = new ConnectionService();
    const stubRequest = sinon.stub(baseConnectionService, 'request')
      .returns(new Promise<any>(resolve => { resolve(returnObject); }));
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.getByKey(5);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p).toEqual(returnObject);
      expect(stubRequest.called).toBe(true);
    }
    finally {
      stubRequest.restore();
    }
  });
  // #endregion getByKey

  // #region method : cloneQuery
  it('cloneQuery one parameter', async () => {
    const qb = new ODataQuery('category');
    const qb2 = qb.cloneQuery();

    expect(qb2).not.toBeNull();
    expect(qb2).not.toBeUndefined();
    expect((qb2 as any)._resource).toEqual('category');
    expect(qb !== qb2).toBe(true);
    expect(qb2).toEqual(qb);
  });
  // #endregion cloneQuery

});
