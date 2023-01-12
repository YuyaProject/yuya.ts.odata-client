import { AxiosError } from 'axios';
import { MutationResultStatus, IMutationResult } from '.';

export class MutationErrorResult<T = any> implements IMutationResult<T> {
  public readonly status = MutationResultStatus.Error;

  constructor(public readonly error: AxiosError) {
  }
}
