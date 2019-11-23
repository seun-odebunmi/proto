import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'

import {
  IGetPasswordPolicy,
  ISavePasswordPolicy
} from './app-password-policy.model'

@Injectable()
export class AppPasswordPolicyService {
  constructor(private apiCall: ApiCallService) {}

  public getPasswordPolicy: IGetPasswordPolicy = () =>
    this.apiCall.get('portal/passwordpolicy')

  public savePasswordPolicy: ISavePasswordPolicy = body =>
    this.apiCall.post(
      'portal/passwordpolicy/update/app',
      body,
      'application/json'
    )
}
