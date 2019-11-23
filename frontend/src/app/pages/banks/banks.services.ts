import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { ApiCallService } from '../../services/api-call.service'
import {
  IUpdateBank,
  ICreateBank,
  IGetBanks,
  IGetBanksReturn
} from './banks.model'

@Injectable()
export class BankService {
  constructor(private apiCall: ApiCallService) {}

  getBanks(body: IGetBanks): Observable<IGetBanksReturn> {
    return this.apiCall.post('portal/system/banks/search', body)
  }

  createBank(user: ICreateBank) {
    return this.apiCall.post(
      'portal/system/bank/create/initiate',
      user,
      'application/json'
    )
  }

  updateBank(user: IUpdateBank) {
    return this.apiCall.put(
      'portal/system/bank/edit/initiate',
      user,
      'application/json'
    )
  }

  activateBank(bankID: number) {
    return this.apiCall.post(
      'portal/system/bank/' + bankID + '/enable/initiate',
      null
    )
  }

  deactivateBank(bankID: number) {
    return this.apiCall.post(
      'portal/system/bank/' + bankID + '/disable/initiate',
      null
    )
  }
}
