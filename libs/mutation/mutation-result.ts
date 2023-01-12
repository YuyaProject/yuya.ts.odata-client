import { AxiosError, AxiosResponse } from 'axios';
import { MutationResultStatus } from '.';

export interface IMutationResult<T = any> {
  readonly axiosResponse?: AxiosResponse<T>;
  readonly status: MutationResultStatus;
  readonly entity?: T;
  readonly error?: AxiosError;
}
