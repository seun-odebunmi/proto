import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'

import {
  IGetPasswordPolicy,
  ISavePasswordPolicy
} from './portal-password-policy.model'

@Injectable()
export class PortalPasswordPolicyService {
  constructor(private apiCall: ApiCallService) {}

  public getPasswordPolicy: IGetPasswordPolicy = () =>
    this.apiCall.get('portal/passwordpolicy')

  public savePasswordPolicy: ISavePasswordPolicy = body =>
    this.apiCall.post(
      'portal/passwordpolicy/update/portal',
      body,
      'application/json'
    )
}
