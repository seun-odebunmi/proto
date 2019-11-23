import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import { IGetDashboard } from './dashboard.model'

@Injectable()
export class DashboardService {
  constructor(private apiCall: ApiCallService) {}

  getDashboardData: IGetDashboard = body => {
    return this.apiCall.post('portal/user/dashboard', body)
  }
}
