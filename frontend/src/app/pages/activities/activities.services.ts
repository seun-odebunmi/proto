import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { ApiCallService } from '../../services/api-call.service'
import { AppSettings } from '../../app.settings'
import {
  IGetActivities,
  IGetActivitiesReturn,
  IGetReportData,
  IGetReportDataReturn
} from './activities.model'

@Injectable()
export class ActivityService {
  constructor(private apiCall: ApiCallService, private settings: AppSettings) {}

  canGenerateReport() {
    return this.settings.settings.canGenerateReport
  }

  getActivities(body: IGetActivities): Observable<IGetActivitiesReturn> {
    return this.apiCall.post('portal/system/activity/logs', body)
  }

  getReportData(body: IGetReportData): Observable<IGetReportDataReturn> {
    return this.apiCall.post('reports/generate', body)
  }
}
