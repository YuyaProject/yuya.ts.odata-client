import { ODataQuery, canQuery, ConnectionService, ExpandBuilder } from '../../libs';
import sinon from 'sinon';
import { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { MutationResultStatus } from '../../libs/mutation';

describe('odata-query tests', () => {
  // #region method : canQuery
  it('canQuery return false', () => {
    const p = canQuery('');
    expect(p).toBe(false);
  });
  it('canQuery return true', () => {
    const p = canQuery(new ODataQuery('a'));
    expect(p).toBe(true);
  });
  // #endregion

  // #region method : constructor
  it('constructor empty parameter', () => {
    const qb = new ODataQuery('');
    expect(qb).not.toBeNull();
    expect(qb).not.toBeUndefined();
    expect(qb.resource).toEqual('');
  });
  it('constructor non-empty parameter', () => {
    const qb = new ODataQuery('category');
    expect(qb).not.toBeNull();
    expect(qb).not.toBeUndefined();
    expect(qb.resource).toEqual('category');
  });
  it('constructor non-empty and connection service parameter', () => {
    const connectionService = new ConnectionService();
    const qb = new ODataQuery('category', connectionService);
    expect(qb).not.toBeNull();
    expect(qb).not.toBeUndefined();
    expect(qb.resource).toEqual('category');
    expect(qb.connectionService).toEqual(connectionService);
  });
  it('constructor with additionalQueryString parameter', () => {
    const qb = new ODataQuery('category', undefined, { a: 'b' });
    expect(qb).not.toBeNull();
    expect(qb).not.toBeUndefined();
    expect(qb.resource).toEqual('category');
    expect((qb as any).createRelativeUrl()).toEqual('odata/category?a=b');
  });
  it('constructor with additionalQueryString parameter(two item)', () => {
    const qb = new ODataQuery('category', undefined, { a: 'b', c: '10' });
    expect(qb).not.toBeNull();
    expect(qb).not.toBeUndefined();
    expect(qb.resource).toEqual('category');
    expect((qb as any).createRelativeUrl()).toEqual('odata/category?a=b&c=10');
  });
  // #endregion

  // #region method : apiVersion
  it('apiVersion non-empty parameter on query', () => {
    const qb = new ODataQuery('category');
    qb.apiVersion('1.0');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('api-version=1.0');
  });
  // #endregion

  // #region method : filter
  it('filter parameterless', () => {
    const qb = new ODataQuery('category').filter();
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(0);
  });
  it('filter one empty string parameter', () => {
    const qb = new ODataQuery('category').filter('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(0);
  });
  it('filter two empty string parameters', () => {
    const qb = new ODataQuery('category').filter('', '');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(0);
  });
  it('filter one non-empty string parameter', () => {
    const qb = new ODataQuery('category').filter('id eq 5');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$filter=id eq 5');
  });
  it('filter one non-empty string parameter with additional query string parameter', () => {
    const qb = new ODataQuery('category', undefined, { a: 'b', c: '10' }).filter('id eq 5');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$filter=id eq 5');
    expect((qb as any).createRelativeUrl()).toEqual('odata/category?$filter=id eq 5&a=b&c=10');
  });
  it('filter two non-empty string parameters', () => {
    const qb = new ODataQuery('category').filter('id eq 5', 'name eq \'John\'');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$filter=id eq 5 and name eq \'John\'');
  });
  it('filter one empty, two non-empty string parameters', () => {
    const qb = new ODataQuery('category').filter('', 'id eq 5', 'name eq \'John\'');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$filter=id eq 5 and name eq \'John\'');
  });
  it('filter non-empty string parameter and multiple calls', () => {
    const qb = new ODataQuery('category').filter('id eq 5').filter('name eq \'John\'');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$filter=(id eq 5)and(name eq \'John\')');
  });
  // #endregion filter

  // #region method : orderBy
  it('orderBy one empty parameter', () => {
    const qb = new ODataQuery('category').orderBy('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(0);
  });
  it('orderBy one empty parameter 2', () => {
    const qb = new ODataQuery('category').orderBy(' ');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(0);
  });
  it('orderBy one non-empty string parameter', () => {
    const qb = new ODataQuery('category').orderBy('id');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$orderby=id');
  });
  it('orderBy one non-empty string parameter with desc', () => {
    const qb = new ODataQuery('category').orderBy('id desc');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$orderby=id desc');
  });
  it('orderBy one non-empty two string parameter', () => {
    const qb = new ODataQuery('category').orderBy('id,name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$orderby=id,name');
  });
  it('orderBy one non-empty two string parameter with whitespaces', () => {
    const qb = new ODataQuery('category').orderBy(' id , name ');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$orderby=id,name');
  });
  it('orderBy multiple call with one non-empty string parameter', () => {
    const qb = new ODataQuery('category')
      .orderBy('id')
      .orderBy('name');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$orderby=id,name');
  });
  it('orderBy multiple call with one non-empty white-spaced string parameter', () => {
    const qb = new ODataQuery('category')
      .orderBy(' id ')
      .orderBy(' name ');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$orderby=id,name');
  });
  // #endregion

  // #region method : top
  it('top one parameter', () => {
    const qb = new ODataQuery('category').top(5);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$top=5');
  });
  // #endregion

  // #region method : skip
  it('skip one parameter', () => {
    const qb = new ODataQuery('category').skip(5);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$skip=5');
  });
  // #endregion

  // #region method : expand
  it('expand one expandbuilder parameter', () => {
    const qb = new ODataQuery('category').expand(new ExpandBuilder('a'));
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$expand=a');
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
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('@id=5');
  });
  it('parameter string value parameters', () => {
    const qb = new ODataQuery('category').parameter('a', 'asd');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('@a=\'asd\'');
  });
  it('parameter two parameters and multiple call', () => {
    const qb = new ODataQuery('category')
      .parameter('id', 5)
      .parameter('name', 'asd');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(2);
    expect(p.queryStrings[0]).toEqual('@id=5');
    expect(p.queryStrings[1]).toEqual('@name=\'asd\'');
  });
  // #endregion parameter

  // #region method : parameters
  it('parameters one string parameter', () => {
    const qb = new ODataQuery('category').parameters('@id=5');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('@id=5');
  });
  it('parameters two string parameters', () => {
    const qb = new ODataQuery('category').parameters('@id=5', '@name=\'asd\'');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(2);
    expect(p.queryStrings[0]).toEqual('@id=5');
    expect(p.queryStrings[1]).toEqual('@name=\'asd\'');
  });
  // #endregion

  // #region method : allPagesRowCount
  it('allPagesRowCount empty parameter', () => {
    const qb = new ODataQuery('category').allPagesRowCount();
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.getAllPagesRowCount).toBe(true);
  });
  it('allPagesRowCount true parameter', () => {
    const qb = new ODataQuery('category').allPagesRowCount(true);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.getAllPagesRowCount).toBe(true);
  });
  it('allPagesRowCount false parameter', () => {
    const qb = new ODataQuery('category').allPagesRowCount(false);
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.getAllPagesRowCount).toBe(false);
  });
  // #endregion

  // #region method : groupBy
  it('groupBy empty string parameter', () => {
    const qb = new ODataQuery('category').groupBy('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(0);
  });
  it('groupBy whitespaced string parameter', () => {
    const qb = new ODataQuery('category').groupBy(' ');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(0);
  });
  it('groupBy string parameter', () => {
    const qb = new ODataQuery('category').groupBy('(name)');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$apply=groupby((name))');
  });
  it('groupBy string parameter with dot', () => {
    const qb = new ODataQuery('category').groupBy('(products.name)');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$apply=groupby((products/name))');
  });
  // #endregion groupBy

  // #region method : apply
  it('apply empty string parameter', () => {
    const qb = new ODataQuery('category').apply('');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(0);
  });
  it('apply whitespaced string parameter', () => {
    const qb = new ODataQuery('category').apply(' ');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(0);
  });
  it('apply string parameter', () => {
    const qb = new ODataQuery('category').apply('groupby((name))');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$apply=groupby((name))');
  });
  it('apply string parameter with dot', () => {
    const qb = new ODataQuery('category').apply('groupby((products.name))');
    const p: any = qb;
    expect(p).not.toBeNull();
    expect(p).not.toBeUndefined();
    expect(p.queryStrings).not.toBeNull();
    expect(p.queryStrings).not.toBeUndefined();
    expect(p.queryStrings.length).toEqual(1);
    expect(p.queryStrings[0]).toEqual('$apply=groupby((products/name))');
  });
  // #endregion apply

  // #region execution

  // #region method : q
  it('q parameterless', async () => {
    const returnObject = { id: 1 };
    const baseConnectionService = new ConnectionService();
    let url: string | undefined = '';
    const stubRequest = sinon.stub(baseConnectionService, 'request')
      .callsFake((x: AxiosRequestConfig) => {
        url = x.url;
        return new Promise<any>((resolve) => { resolve(returnObject); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.q();
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p).toEqual(returnObject);
      expect(stubRequest.called).toBe(true);
      expect(url).toBe('http://localhost:5000/odata/category');
    } finally {
      stubRequest.restore();
    }
  });
  it('q parameterless with filter', async () => {
    const returnObject = { id: 1 };
    const baseConnectionService = new ConnectionService();
    let url: string | undefined = '';
    const stubRequest = sinon.stub(baseConnectionService, 'request')
      .callsFake((x: AxiosRequestConfig) => {
        url = x.url;
        return new Promise<any>((resolve) => { resolve(returnObject); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService).filter('id eq 1');

      const p = await qb.q();
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p).toEqual(returnObject);
      expect(stubRequest.called).toBe(true);
      expect(url).toBe('http://localhost:5000/odata/category?$filter=id eq 1');
    } finally {
      stubRequest.restore();
    }
  });

  it('q parameterless with filter and rowcount', async () => {
    const returnObject = { id: 1 };
    const baseConnectionService = new ConnectionService();
    let url: string | undefined = '';
    const stubRequest = sinon.stub(baseConnectionService, 'request')
      .callsFake((x: AxiosRequestConfig) => {
        url = x.url;
        return new Promise<any>((resolve) => { resolve(returnObject); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService).filter('id eq 1').allPagesRowCount();

      const p = await qb.q();
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p).toEqual(returnObject);
      expect(stubRequest.called).toBe(true);
      expect(url).toBe('http://localhost:5000/odata/category?$filter=id eq 1&$count=true');
    } finally {
      stubRequest.restore();
    }
  });
  // #endregion q

  // #region method : count
  it('count parameterless', async () => {
    const returnNumber = 5;
    const baseConnectionService = new ConnectionService();
    let url: string | undefined = '';
    const stubRequest = sinon.stub(baseConnectionService, 'requestT')
      .callsFake((x: AxiosRequestConfig) => {
        url = x.url;
        return new Promise<number>((resolve) => { resolve(returnNumber); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.count();
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p).toEqual(returnNumber);
      expect(stubRequest.called).toBe(true);
      expect(url).toBe('http://localhost:5000/odata/category/$count');
    } finally {
      stubRequest.restore();
    }
  });
  // #endregion count

  // #region method : getByKey
  it('getByKey one parameter', async () => {
    const returnObject = { id: 5 };
    const baseConnectionService = new ConnectionService();
    let url: string | undefined = '';
    const stubRequest = sinon.stub(baseConnectionService, 'request')
      .callsFake((x: AxiosRequestConfig) => {
        url = x.url;
        return new Promise<any>((resolve) => { resolve(returnObject); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.getByKey(5);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p).toEqual(returnObject);
      expect(stubRequest.called).toBe(true);
      expect(url).toBe('http://localhost:5000/odata/category(5)');
    } finally {
      stubRequest.restore();
    }
  });
  // #endregion getByKey

  // #endregion

  // #region Mutations

  // #region post

  it('post response status 200', async () => {
    const requestObject: { name: string } = { name: 'aaa' };
    const returnObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubPost = sinon.stub(baseConnectionService, 'post')
      .callsFake((x, y, z) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.post<{ id: number, name: string }>(requestObject);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Ok);
      expect(p.axiosResponse).toEqual(axiosResponse);
      expect(p.entity).toEqual(returnObject);
      expect(stubPost.called).toBe(true);
      expect(url).toBe('odata/category');
    } finally {
      stubPost.restore();
    }
  });

  it('post response status 201', async () => {
    const requestObject: { name: string } = { name: 'aaa' };
    const returnObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubPost = sinon.stub(baseConnectionService, 'post')
      .callsFake((x, y, z) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.post<{ id: number, name: string }>(requestObject);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Ok);
      expect(p.axiosResponse).toEqual(axiosResponse);
      expect(p.entity).toEqual(returnObject);
      expect(stubPost.called).toBe(true);
      expect(url).toBe('odata/category');
    } finally {
      stubPost.restore();
    }
  });

  it('post response status 204', async () => {
    const requestObject: { name: string } = { name: 'aaa' };
    const returnObject = {};
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 204,
      statusText: 'No Content',
      headers: {},
      config: {},
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubPost = sinon.stub(baseConnectionService, 'post')
      .callsFake((x, y, z) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.post<{ id: number, name: string }>(requestObject);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Ok);
      expect(p.axiosResponse).toEqual(axiosResponse);
      expect(p.entity).toEqual(returnObject);
      expect(stubPost.called).toBe(true);
      expect(url).toBe('odata/category');
    } finally {
      stubPost.restore();
    }
  });

  it('post response status 299', async () => {
    const requestObject: { name: string } = { name: 'aaa' };
    const returnObject = {};
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 299,
      statusText: 'No Supported',
      headers: {},
      config: {},
      request: { config: {} },
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubPost = sinon.stub(baseConnectionService, 'post')
      .callsFake((x, y, z) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.post<{ id: number, name: string }>(requestObject);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Error);
      expect(p.error).not.toBeNull();
      expect(p.error).not.toBeUndefined();
      expect(p.error!.code).toEqual('599');
      expect(p.error!.name).toEqual('NotSupported');
      expect(p.error!.message).toEqual('Not supported http status : 299');
      expect(stubPost.called).toBe(true);
      expect(url).toBe('odata/category');
    } finally {
      stubPost.restore();
    }
  });

  // 404 error
  it('post response status 404', async () => {
    const requestObject: { name: string } = { name: 'aaa' };
    const returnObject = {};
    const error: AxiosError = {
      code: '404',
      name: 'NotFound',
      message: 'Not Found',
      config: {},
      isAxiosError: true,
      toJSON: () => Object,
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubPost = sinon.stub(baseConnectionService, 'post')
      .callsFake((x, y, z) => {
        url = x;
        return new Promise<AxiosResponse>((resolve, reject) => { reject(error); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      await qb.post<{ id: number, name: string }>(requestObject);
    } catch (ex: any) {
      expect(ex).not.toBeNull();
      expect(ex).not.toBeUndefined();
      expect(ex.status).toEqual(MutationResultStatus.Error);
      expect(ex.error).not.toBeNull();
      expect(ex.error).not.toBeUndefined();
      expect(ex.error).toEqual(error);
      expect(stubPost.called).toBe(true);
      expect(url).toBe('odata/category');
    } finally {
      stubPost.restore();
    }
  });

  // #endregion

  // #region put

  it('put response status 200', async () => {
    const requestObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const returnObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubPut = sinon.stub(baseConnectionService, 'put')
      .callsFake((x, y, z) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.put<{ id: number, name: string }>(requestObject.id, requestObject);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Ok);
      expect(p.axiosResponse).toEqual(axiosResponse);
      expect(p.entity).toEqual(returnObject);
      expect(stubPut.called).toBe(true);
      expect(url).toBe(`odata/category(${requestObject.id})`);
    } finally {
      stubPut.restore();
    }
  });

  it('put response status 201', async () => {
    const requestObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const returnObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubPut = sinon.stub(baseConnectionService, 'put')
      .callsFake((x, y, z) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.put<{ id: number, name: string }>(requestObject.id, requestObject);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Ok);
      expect(p.axiosResponse).toEqual(axiosResponse);
      expect(p.entity).toEqual(returnObject);
      expect(stubPut.called).toBe(true);
      expect(url).toBe(`odata/category(${requestObject.id})`);
    } finally {
      stubPut.restore();
    }
  });

  it('put response status 204', async () => {
    const requestObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const returnObject = {};
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 204,
      statusText: 'No Content',
      headers: {},
      config: {},
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubPut = sinon.stub(baseConnectionService, 'put')
      .callsFake((x, y, z) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.put<{ id: number, name: string }>(requestObject.id, requestObject);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Ok);
      expect(p.axiosResponse).toEqual(axiosResponse);
      expect(p.entity).toEqual(returnObject);
      expect(stubPut.called).toBe(true);
      expect(url).toBe(`odata/category(${requestObject.id})`);
    } finally {
      stubPut.restore();
    }
  });

  it('put response status 299', async () => {
    const requestObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const returnObject = {};
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 299,
      statusText: 'No Supported',
      headers: {},
      config: {},
      request: { config: {} },
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubPut = sinon.stub(baseConnectionService, 'put')
      .callsFake((x, y, z) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.put<{ id: number, name: string }>(requestObject.id, requestObject);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Error);
      expect(p.error).not.toBeNull();
      expect(p.error).not.toBeUndefined();
      expect(p.error!.code).toEqual('599');
      expect(p.error!.name).toEqual('NotSupported');
      expect(p.error!.message).toEqual('Not supported http status : 299');
      expect(stubPut.called).toBe(true);
      expect(url).toBe(`odata/category(${requestObject.id})`);
    } finally {
      stubPut.restore();
    }
  });

  // 404 error
  it('put response status 404', async () => {
    const requestObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const returnObject = {};
    const error: AxiosError = {
      code: '404',
      name: 'NotFound',
      message: 'Not Found',
      config: {},
      isAxiosError: true,
      toJSON: () => Object,
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubPut = sinon.stub(baseConnectionService, 'put')
      .callsFake((x, y, z) => {
        url = x;
        return new Promise<AxiosResponse>((resolve, reject) => { reject(error); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      await qb.put<{ id: number, name: string }>(requestObject.id, requestObject);
    } catch (ex: any) {
      expect(ex).not.toBeNull();
      expect(ex).not.toBeUndefined();
      expect(ex.status).toEqual(MutationResultStatus.Error);
      expect(ex.error).not.toBeNull();
      expect(ex.error).not.toBeUndefined();
      expect(ex.error).toEqual(error);
      expect(stubPut.called).toBe(true);
      expect(url).toBe(`odata/category(${requestObject.id})`);
    } finally {
      stubPut.restore();
    }
  });

  // #endregion

  // #region patch

  it('patch response status 200', async () => {
    const requestObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const returnObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubPatch = sinon.stub(baseConnectionService, 'patch')
      .callsFake((x, y, z) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.patch<{ id: number, name: string }>(requestObject.id, requestObject);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Ok);
      expect(p.axiosResponse).toEqual(axiosResponse);
      expect(p.entity).toEqual(returnObject);
      expect(stubPatch.called).toBe(true);
      expect(url).toBe(`odata/category(${requestObject.id})`);
    } finally {
      stubPatch.restore();
    }
  });

  it('patch response status 201', async () => {
    const requestObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const returnObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubPatch = sinon.stub(baseConnectionService, 'patch')
      .callsFake((x, y, z) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.patch<{ id: number, name: string }>(requestObject.id, requestObject);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Ok);
      expect(p.axiosResponse).toEqual(axiosResponse);
      expect(p.entity).toEqual(returnObject);
      expect(stubPatch.called).toBe(true);
      expect(url).toBe(`odata/category(${requestObject.id})`);
    } finally {
      stubPatch.restore();
    }
  });

  it('patch response status 204', async () => {
    const requestObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const returnObject = {};
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 204,
      statusText: 'No Content',
      headers: {},
      config: {},
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubPatch = sinon.stub(baseConnectionService, 'patch')
      .callsFake((x, y, z) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.patch<{ id: number, name: string }>(requestObject.id, requestObject);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Ok);
      expect(p.axiosResponse).toEqual(axiosResponse);
      expect(p.entity).toEqual(returnObject);
      expect(stubPatch.called).toBe(true);
      expect(url).toBe(`odata/category(${requestObject.id})`);
    } finally {
      stubPatch.restore();
    }
  });

  it('patch response status 299', async () => {
    const requestObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const returnObject = {};
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 299,
      statusText: 'No Supported',
      headers: {},
      config: {},
      request: { config: {} },
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubPatch = sinon.stub(baseConnectionService, 'patch')
      .callsFake((x, y, z) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.patch<{ id: number, name: string }>(requestObject.id, requestObject);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Error);
      expect(p.error).not.toBeNull();
      expect(p.error).not.toBeUndefined();
      expect(p.error!.code).toEqual('599');
      expect(p.error!.name).toEqual('NotSupported');
      expect(p.error!.message).toEqual('Not supported http status : 299');
      expect(stubPatch.called).toBe(true);
      expect(url).toBe(`odata/category(${requestObject.id})`);
    } finally {
      stubPatch.restore();
    }
  });

  // 404 error
  it('patch response status 404', async () => {
    const requestObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const returnObject = {};
    const error: AxiosError = {
      code: '404',
      name: 'NotFound',
      message: 'Not Found',
      config: {},
      isAxiosError: true,
      toJSON: () => Object,
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubPatch = sinon.stub(baseConnectionService, 'patch')

      .callsFake((x, y, z) => {
        url = x;
        return new Promise<AxiosResponse>((resolve, reject) => { reject(error); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      await qb.patch<{ id: number, name: string }>(requestObject.id, requestObject);
    } catch (ex: any) {
      expect(ex).not.toBeNull();
      expect(ex).not.toBeUndefined();
      expect(ex.status).toEqual(MutationResultStatus.Error);
      expect(ex.error).not.toBeNull();
      expect(ex.error).not.toBeUndefined();
      expect(ex.error).toEqual(error);
      expect(stubPatch.called).toBe(true);
      expect(url).toBe(`odata/category(${requestObject.id})`);
    } finally {
      stubPatch.restore();
    }
  });

  // #endregion

  // #region delete

  it('delete response status 200', async () => {
    const returnObject = {};
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubDelete = sinon.stub(baseConnectionService, 'dele')
      .callsFake((x, y) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.delete(1);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Ok);
      expect(p.axiosResponse).toEqual(axiosResponse);
      expect(p.entity).toEqual(returnObject);
      expect(stubDelete.called).toBe(true);
      expect(url).toBe('odata/category(1)');
    } finally {
      stubDelete.restore();
    }
  });

  it('delete response status 201', async () => {
    const returnObject = {};
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubDelete = sinon.stub(baseConnectionService, 'dele')
      .callsFake((x, y) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.delete(1);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Ok);
      expect(p.axiosResponse).toEqual(axiosResponse);
      expect(p.entity).toEqual(returnObject);
      expect(stubDelete.called).toBe(true);
      expect(url).toBe('odata/category(1)');
    } finally {
      stubDelete.restore();
    }
  });

  it('delete response status 204', async () => {
    const returnObject = {};
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 204,
      statusText: 'No Content',
      headers: {},
      config: {},
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubDelete = sinon.stub(baseConnectionService, 'dele')

      .callsFake((x, y) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.delete(1);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Ok);
      expect(p.axiosResponse).toEqual(axiosResponse);
      expect(p.entity).toEqual(returnObject);
      expect(stubDelete.called).toBe(true);
      expect(url).toBe('odata/category(1)');
    } finally {
      stubDelete.restore();
    }
  });


  it('delete response status 299', async () => {
    const requestObject: { id: number, name: string } = { id: 1, name: 'aaa' };
    const returnObject = {};
    const axiosResponse: AxiosResponse = {
      data: returnObject,
      status: 299,
      statusText: 'No Supported',
      headers: {},
      config: {},
      request: { config: {} },
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubDelete = sinon.stub(baseConnectionService, 'dele')
      .callsFake((x, y) => {
        url = x;
        return new Promise<AxiosResponse>((resolve) => { resolve(axiosResponse); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      const p = await qb.delete<{ id: number, name: string }>(requestObject.id);
      expect(p).not.toBeNull();
      expect(p).not.toBeUndefined();
      expect(p.status).toEqual(MutationResultStatus.Error);
      expect(p.error).not.toBeNull();
      expect(p.error).not.toBeUndefined();
      expect(p.error!.code).toEqual('599');
      expect(p.error!.name).toEqual('NotSupported');
      expect(p.error!.message).toEqual('Not supported http status : 299');
      expect(stubDelete.called).toBe(true);
      expect(url).toBe(`odata/category(${requestObject.id})`);
    } finally {
      stubDelete.restore();
    }
  });

  // 404 error
  it('delete response status 404', async () => {
    const error: AxiosError = {
      code: '404',
      name: 'NotFound',
      message: 'Not Found',
      config: {},
      isAxiosError: true,
      toJSON: () => Object,
    };
    const baseConnectionService = new ConnectionService();
    let url = '';
    const stubDelete = sinon.stub(baseConnectionService, 'dele')
      .callsFake((x: any) => {
        url = x;
        return new Promise<AxiosResponse>((resolve, reject) => { reject(error); });
      });
    try {
      const qb = new ODataQuery('category', baseConnectionService);
      await qb.delete(1);
    } catch (ex: any) {
      expect(ex).not.toBeNull();
      expect(ex).not.toBeUndefined();
      expect(ex.status).toEqual(MutationResultStatus.Error);
      expect(ex.error).not.toBeNull();
      expect(ex.error).not.toBeUndefined();
      expect(ex.error).toEqual(error);
      expect(stubDelete.called).toBe(true);
      expect(url).toBe('odata/category(1)');
    } finally {
      stubDelete.restore();
    }
  });

  // #endregion

  // #endregion

  // #region method : cloneQuery
  it('cloneQuery one parameter', async () => {
    const qb = new ODataQuery('category');
    const qb2 = qb.cloneQuery();

    expect(qb2).not.toBeNull();
    expect(qb2).not.toBeUndefined();
    expect((qb2 as any).resource).toEqual('category');
    expect(qb !== qb2).toBe(true);
    expect(qb2).toEqual(qb);
  });
  // #endregion cloneQuery
});
