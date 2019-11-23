import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import { IResetPassword } from './password-reset.model'

@Injectable()
export class PasswordResetService {
  constructor(private apiCall: ApiCallService) {}

  resetPassword(body: IResetPassword) {
    return this.apiCall.post(
      'portal/credentials/customer/password/reset/initiate',
      body
    )
  }
}
