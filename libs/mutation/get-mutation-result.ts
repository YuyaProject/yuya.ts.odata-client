import { AxiosError, AxiosResponse } from 'axios';
import { MutationResultStatus, IMutationResult, MutationSuccessResult } from '.';
import { MutationErrorResult } from './mutation-error-result';

export function getMutationResult<T = any>(response: AxiosResponse<T>): IMutationResult<T> {
  if ([200, 201, 204].some((x) => x === response.status)) {
    return new MutationSuccessResult<T>(response, MutationResultStatus.Ok, response.data);
  }
  return new MutationErrorResult<T>({
    code: '599',
    request: response.request,
    name: 'NotSupported',
    message: 'Not supported http status : ' + response.status,
    config: response.request.config,
    response,
  } as AxiosError);
}
