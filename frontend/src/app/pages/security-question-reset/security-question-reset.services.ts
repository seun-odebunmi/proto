import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import { IResetSecurity } from './security-question-reset.model'

@Injectable()
export class SecurityQuestionResetService {
  constructor(private apiCall: ApiCallService) {}

  resetSecurity(body: IResetSecurity) {
    return this.apiCall.post(
      'portal/credentials/securityQandA/reset/initiate',
      body
    )
  }
}
