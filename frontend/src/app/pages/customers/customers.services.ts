import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import { AppSettings } from '../../app.settings'
import {
  IGetCustomers,
  IGetRegStatus,
  ISearchCustomer,
  IDeactivateCustomer,
  IActivateCustomer,
  IReleaseCustomer
} from './customers.model'

@Injectable()
export class CustomerService {
  constructor(private apiCall: ApiCallService, private settings: AppSettings) {}

  public canReleaseCustomer = () => this.settings.settings.canReleaseCustomer

  public getRegistrationStatus: IGetRegStatus = () =>
    this.apiCall.get('portal/customer/registrationStatus')

  public getCustomers: IGetCustomers = body =>
    this.apiCall.post('portal/customer/list', body)

  public searchCustomer: ISearchCustomer = body =>
    this.apiCall.post('portal/customer/search', body)

  public activateCustomer: IActivateCustomer = customerId =>
    this.apiCall.post(
      'portal/customer/' + customerId + '/enable/initiate',
      null
    )

  public deactivateCustomer: IDeactivateCustomer = (customerId, reason) =>
    this.apiCall.post('portal/customer/' + customerId + '/disable', {
      reason
    })

  public releaseCustomer: IReleaseCustomer = customerId =>
    this.apiCall.post(
      'portal/customer/' + customerId + '/release/initiate',
      null
    )
}
