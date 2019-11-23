import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import { IResetPin } from './pin-reset.model'

@Injectable()
export class PinResetService {
  constructor(private apiCall: ApiCallService) {}

  resetPin(body: IResetPin) {
    return this.apiCall.post('portal/credentials/pin/reset/initiate', body)
  }
}
