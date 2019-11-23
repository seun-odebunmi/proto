import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import { IGetCustomerCards, ISetCustomerPin } from './set-customer-pin.model'

@Injectable()
export class SetCustomerPinService {
  constructor(private apiCall: ApiCallService) {}

  public getCustomerCards: IGetCustomerCards = body =>
    this.apiCall.get(`customer/cards/${body.userLoginID}`)

  public setCustomerPin: ISetCustomerPin = body =>
    this.apiCall.post(
      'customer/card/request/pin-reset',
      body,
      'application/json'
    )
}
