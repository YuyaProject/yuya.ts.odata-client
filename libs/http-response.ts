import { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';

export default interface HttpResponse<T> {
  data: T;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
}
