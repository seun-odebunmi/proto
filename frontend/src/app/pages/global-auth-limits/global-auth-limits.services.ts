import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { ApiCallService } from '../../services/api-call.service'
import {
  IUpdateGlobalAuthLimit,
  ISearchGlobalAuthLimit,
  IGetGlobalAuthLimitTypesReturn,
  ISearchGlobalAuthLimitReturn
} from './global-auth-limits.model'

@Injectable()
export class GlobalAuthLimitService {
  constructor(private apiCall: ApiCallService) {}

  getGlobalAuthLimitTypes(): Observable<IGetGlobalAuthLimitTypesReturn> {
    return this.apiCall.get('portal/limit/auth/limitTypes')
  }

  searchGlobalAuthLimit(
    body: ISearchGlobalAuthLimit
  ): Observable<ISearchGlobalAuthLimitReturn> {
    return this.apiCall.post('portal/limit/auth/search', body)
  }

  updateGlobalAuthLimit(body: IUpdateGlobalAuthLimit) {
    return this.apiCall.put(
      'portal/limit/auth/edit/initiate',
      body,
      'application/json'
    )
  }
}
