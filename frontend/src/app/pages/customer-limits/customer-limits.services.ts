import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { ApiCallService } from '../../services/api-call.service'
import { AppSettings } from '../../app.settings'
import {
  IUpdateCustomerLimit,
  ICreateCustomerLimit,
  ISearchCustomerLimit,
  IGetCustomerLimitTypesReturn,
  ISearchCustomerLimitReturn
} from './customer-limits.model'

@Injectable()
export class CustomerLimitService {
  constructor(private apiCall: ApiCallService, private settings: AppSettings) {}

  getCustomerLimitTypes(): Observable<IGetCustomerLimitTypesReturn> {
    return this.apiCall.get('portal/limit/customer/limitTypes')
  }

  supportPerTransactionLimit() {
    return this.settings.settings.supportPerTransactionLimit
  }

  searchCustomerLimit(
    body: ISearchCustomerLimit
  ): Observable<ISearchCustomerLimitReturn> {
    return this.apiCall.post('portal/limit/customer/search', body)
  }

  updateCustomerLimit(body: IUpdateCustomerLimit) {
    return this.apiCall.put(
      'portal/limit/customer/edit/initiate',
      body,
      'application/json'
    )
  }

  createCustomerLimit(body: ICreateCustomerLimit) {
    return this.apiCall.post(
      'portal/limit/customer/create/initiate',
      body,
      'application/json'
    )
  }

  deleteCustomerLimit(customerLimitId: number) {
    return this.apiCall.delete(
      'portal/limit/customer/' + customerLimitId + '/delete/initiate'
    )
  }
}
