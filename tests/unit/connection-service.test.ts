import { ConnectionService, config, IConnetionSettings } from '../../libs/connection-service';
import axios, { AxiosResponse } from 'axios';
import sinon from 'sinon';

// TODO : @alper-2019-02-14: ErrorHandler ile ilgili kısım için bir test yazmadım. Bunun yazılması lazım.

describe('default-connection-service tests', () => {
  // #region method : constructor
  it('constructor empty parameter', () => {
    const r = new ConnectionService();
    expect(r.connetionSettings).toBe(config);
  });
  it('constructor non-empty parameter', () => {
    const connectionSettings: IConnetionSettings = { baseUrl: '/api', odataEndpoint: 'odata' };
    const r = new ConnectionService(connectionSettings);
    expect(r.connetionSettings).toBe(connectionSettings);
  });
  // #endregion prepareServiceUrl

  // #region method : prepareServiceUrl
  it('getServiceUrl empty parameter', () => {
    const response = new ConnectionService().prepareServiceUrl('');
    expect(response).not.toBe('');
  });
  it('getServiceUrl with parameter', () => {
    const response = new ConnectionService().prepareServiceUrl('deneme');
    expect(response.endsWith('/deneme')).toBe(true);
  });
  it('getServiceUrl with parameter 2', () => {
    const response = new ConnectionService().prepareServiceUrl('/deneme');
    expect(response.endsWith('/deneme')).toBe(true);
  });
  // #endregion prepareServiceUrl

  // #region methods : get, getT
  it('get with empty parameter', async () => {
    const axiosStub = sinon.stub(axios, 'get');
    axiosStub
      .returns(new Promise<AxiosResponse<any>>((resolve) => {
        resolve({ data: [], status: 200, statusText: 'OK', config: {}, headers: {} });
      }));
    try {
      const response = await new ConnectionService().get('deneme');
      // console.log(response);
      expect(response).toEqual([]);
    } finally {
      axiosStub.restore();
    }
  });
  it('getT with empty parameter', async () => {
    const axiosStub = sinon.stub(axios, 'get');
    const returnData: Array<{ id: number, name: string }> = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];
    axiosStub
      .returns(new Promise<AxiosResponse<any>>((resolve) => {
        resolve({ data: returnData, status: 200, statusText: 'OK', config: {}, headers: {} });
      }));
    try {
      const response = await new ConnectionService().getT<Array<{ id: number, name: string }>>('deneme');
      // console.log(response);
      expect(response).toEqual(returnData);
      expect(response.length).toBe(2);
    } finally {
      axiosStub.restore();
    }
  });
  // #endregion

  // #region methods : request, requestT
  it('request with parameter', async () => {
    const axiosStub = sinon.stub(axios, 'request');
    axiosStub
      .returns(new Promise<AxiosResponse<any>>((resolve) => {
        resolve({ data: [], status: 200, statusText: 'OK', config: {}, headers: {} });
      }));
    try {
      const response = await new ConnectionService().request({ method: 'get', url: 'deneme' });
      // console.log(response);
      expect(response).toEqual([]);
    } finally {
      axiosStub.restore();
    }
  });
  it('requestT with parameter', async () => {
    const axiosStub = sinon.stub(axios, 'request');
    const returnData: Array<{ id: number, name: string }> = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];
    axiosStub
      .returns(new Promise<AxiosResponse<any>>((resolve) => {
        resolve({ data: returnData, status: 200, statusText: 'OK', config: {}, headers: {} });
      }));
    try {
      const response =
        await new ConnectionService()
          .requestT<Array<{ id: number, name: string }>>({ method: 'get', url: 'deneme' });
      // console.log(response);
      expect(response).toEqual(returnData);
      expect(response.length).toBe(2);
    } finally {
      axiosStub.restore();
    }
  });
  // #endregion

  // #region methods : post, postT
  it('post with empty parameter', async () => {
    const axiosStub = sinon.stub(axios, 'post');
    axiosStub
      .returns(new Promise<AxiosResponse<any>>((resolve) => {
        resolve({ data: [], status: 200, statusText: 'OK', config: {}, headers: {} });
      }));
    try {
      const response = await new ConnectionService().post('deneme', {});
      // console.log(response);
      expect(response).not.toBeNull();
      expect(response.data).toEqual([]);
      expect(response.status).toBe(200);
    } finally {
      axiosStub.restore();
    }
  });
  it('postT with empty parameter', async () => {
    const axiosStub = sinon.stub(axios, 'post');
    const returnData: Array<{ id: number, name: string }> = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];
    axiosStub
      .returns(new Promise<AxiosResponse<any>>((resolve) => {
        resolve({ data: returnData, status: 200, statusText: 'OK', config: {}, headers: {} });
      }));
    try {
      const response = await new ConnectionService().postT<Array<{ id: number, name: string }>>('deneme', {});
      // console.log(response);
      expect(response).toEqual(returnData);
      expect(response.length).toBe(2);
    } finally {
      axiosStub.restore();
    }
  });
  // #endregion

  // #region methods : put, putT
  it('put with empty parameter', async () => {
    const axiosStub = sinon.stub(axios, 'put');
    axiosStub
      .returns(new Promise<AxiosResponse<any>>((resolve) => {
        resolve({ data: [], status: 200, statusText: 'OK', config: {}, headers: {} });
      }));
    try {
      const response = await new ConnectionService().put('deneme', {});
      // console.log(response);
      expect(response).not.toBeNull();
      expect(response.data).toEqual([]);
      expect(response.status).toBe(200);
    } finally {
      axiosStub.restore();
    }
  });
  it('putT with empty parameter', async () => {
    const axiosStub = sinon.stub(axios, 'put');
    const returnData: Array<{ id: number, name: string }> = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];
    axiosStub
      .returns(new Promise<AxiosResponse<any>>((resolve) => {
        resolve({ data: returnData, status: 200, statusText: 'OK', config: {}, headers: {} });
      }));
    try {
      const response = await new ConnectionService().putT<Array<{ id: number, name: string }>>('deneme', {});
      // console.log(response);
      expect(response).toEqual(returnData);
      expect(response.length).toBe(2);
    } finally {
      axiosStub.restore();
    }
  });
  // #endregion

  // #region methods : patch, patchT
  it('patch with empty parameter', async () => {
    const axiosStub = sinon.stub(axios, 'patch');
    axiosStub
      .returns(new Promise<AxiosResponse<any>>((resolve) => {
        resolve({ data: [], status: 200, statusText: 'OK', config: {}, headers: {} });
      }));
    try {
      const response = await new ConnectionService().patch('deneme', {});
      // console.log(response);
      expect(response).not.toBeNull();
      expect(response.data).toEqual([]);
      expect(response.status).toBe(200);
    } finally {
      axiosStub.restore();
    }
  });
  it('patchT with empty parameter', async () => {
    const axiosStub = sinon.stub(axios, 'patch');
    const returnData: Array<{ id: number, name: string }> = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];
    axiosStub
      .returns(new Promise<AxiosResponse<any>>((resolve) => {
        resolve({ data: returnData, status: 200, statusText: 'OK', config: {}, headers: {} });
      }));
    try {
      const response = await new ConnectionService().patchT<Array<{ id: number, name: string }>>('deneme', {});
      // console.log(response);
      expect(response).toEqual(returnData);
      expect(response.length).toBe(2);
    } finally {
      axiosStub.restore();
    }
  });
  // #endregion

  // #region methods : delete, deleteT
  it('delete with empty parameter', async () => {
    const axiosStub = sinon.stub(axios, 'delete');
    axiosStub
      .returns(new Promise<AxiosResponse<any>>((resolve) => {
        resolve({ data: [], status: 200, statusText: 'OK', config: {}, headers: {} });
      }));
    try {
      const response = await new ConnectionService().dele('deneme');
      // console.log(response);
      expect(response).not.toBeNull();
      expect(response.data).toEqual([]);
      expect(response.status).toBe(200);
    } finally {
      axiosStub.restore();
    }
  });
  it('deleteT with empty parameter', async () => {
    const axiosStub = sinon.stub(axios, 'delete');
    const returnData: Array<{ id: number, name: string }> = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];
    axiosStub
      .returns(new Promise<AxiosResponse<any>>((resolve) => {
        resolve({ data: returnData, status: 200, statusText: 'OK', config: {}, headers: {} });
      }));
    try {
      const response = await new ConnectionService().deleT<Array<{ id: number, name: string }>>('deneme');
      // console.log(response);
      expect(response).toEqual(returnData);
      expect(response.length).toBe(2);
    } finally {
      axiosStub.restore();
    }
  });
  // #endregion
});
