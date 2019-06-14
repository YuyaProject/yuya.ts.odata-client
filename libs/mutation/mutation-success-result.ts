import { AxiosResponse, MutationResultStatus, IMutationResult } from '.';

export class MutationSuccessResult<T = any> implements IMutationResult<T> {
  constructor(
    public readonly axiosResponse: AxiosResponse<T>,
    public readonly status: MutationResultStatus,
    public readonly entity?: T) {
  }
}
