import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { ApiCallService } from '../../services/api-call.service'
import {
  IUpdateBiller,
  ICreateBiller,
  IGetBillers,
  IGetBillersReturn
} from './billers.model'

@Injectable()
export class BillerService {
  constructor(private apiCall: ApiCallService) {}

  getBillers(body: IGetBillers): Observable<IGetBillersReturn> {
    return this.apiCall.post('portal/system/billers/search', body)
  }

  getAllBillers(): Observable<IGetBillersReturn> {
    return this.apiCall.get('portal/system/billers')
  }

  createBiller(biller: ICreateBiller[]) {
    return this.apiCall.post(
      'portal/system/biller/create/initiate',
      biller,
      'application/json'
    )
  }

  updateBiller(biller: IUpdateBiller[]) {
    return this.apiCall.put(
      'portal/system/biller/edit/initiate',
      biller,
      'application/json'
    )
  }

  activateBiller(billerID: number) {
    return this.apiCall.post(
      'portal/system/biller/' + billerID + '/enable/initiate',
      null
    )
  }

  deactivateBiller(billerID: number) {
    return this.apiCall.post(
      'portal/system/biller/' + billerID + '/disable/initiate',
      null
    )
  }
}
