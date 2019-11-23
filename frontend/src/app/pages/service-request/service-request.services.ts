import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { ApiCallService } from '../../services/api-call.service'
import {
  IGetServiceRequests,
  IGetServiceRequestsReturn,
  IReqStatusReturn
} from './service-request.model'

@Injectable()
export class ServiceRequestService {
  constructor(private apiCall: ApiCallService) {}

  getRequestStatus(): Observable<IReqStatusReturn> {
    return this.apiCall.get('portal/servicerequest/serviceRequestStatuses')
  }

  getRequestServices(
    body: IGetServiceRequests
  ): Observable<IGetServiceRequestsReturn> {
    return this.apiCall.post('portal/servicerequest/list', body)
  }

  changeStatus(serviceRequestID: number) {
    return this.apiCall.post(
      'portal/servicerequest/' + serviceRequestID + '/changestatus/initiate',
      null
    )
  }

  approve(serviceRequestID: number) {
    return this.apiCall.post(
      'portal/servicerequest/' + serviceRequestID + '/approve/initiate',
      null
    )
  }

  decline(serviceRequestID: number) {
    return this.apiCall.post(
      'portal/servicerequest/' + serviceRequestID + '/decline/initiate',
      null
    )
  }
}
