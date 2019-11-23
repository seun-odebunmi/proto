import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { ApiCallService } from '../../services/api-call.service'
import { AppSettings } from '../../app.settings'
import {
  IUpdateGlobalLimit,
  ISearchGlobalLimit,
  IGetGlobalLimitTypesReturn,
  ISearchGlobalLimitReturn
} from './global-limits.model'

@Injectable()
export class GlobalLimitService {
  constructor(private apiCall: ApiCallService, private settings: AppSettings) {}

  getGlobalLimitTypes(): Observable<IGetGlobalLimitTypesReturn> {
    return this.apiCall.get('portal/limit/global/limitTypes')
  }

  supportPerTransactionLimit() {
    return this.settings.settings.supportPerTransactionLimit
  }

  searchGlobalLimit(
    body: ISearchGlobalLimit
  ): Observable<ISearchGlobalLimitReturn> {
    return this.apiCall.post('portal/limit/global/search', body)
  }

  updateGlobalLimit(body: IUpdateGlobalLimit) {
    return this.apiCall.put(
      'portal/limit/global/edit/initiate',
      body,
      'application/json'
    )
  }
}
