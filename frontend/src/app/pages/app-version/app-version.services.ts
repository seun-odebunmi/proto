import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { ApiCallService } from '../../services/api-call.service'
import { IGetVersionNumberReturn } from './app-version.model'

@Injectable()
export class AppVersionService {
  constructor(private apiCall: ApiCallService) {}

  getVersionNumber(): Observable<IGetVersionNumberReturn> {
    return this.apiCall.get('portal/system/biller/version')
  }

  increaseVersionNumber() {
    return this.apiCall.post('portal/system/biller/version/increase', null)
  }
}
