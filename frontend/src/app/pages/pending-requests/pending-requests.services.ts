import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import {
  IGetPendingRequests,
  IGetRequestType,
  IApproveRequest,
  IDeclineRequest,
  GET_PENDING_REQUEST_QUERY,
  GET_REQUEST_TYPE_QUERY,
  APPROVE_REQUEST_QUERY,
  DECLINE_REQUEST_QUERY
} from './pending-requests.model'

@Injectable()
export class PendingRequestService {
  constructor(private apiCall: ApiCallService) {}

  getPendingRequests: IGetPendingRequests = body => {
    return this.apiCall
      .query(GET_PENDING_REQUEST_QUERY, body)
      .map(res => res.pendingRequests)
  }

  getRequestTypes: IGetRequestType = () => {
    return this.apiCall
      .query(GET_REQUEST_TYPE_QUERY)
      .map(res => res.requestTypes)
  }

  approveRequest = requestId => {
    return this.apiCall.post(
      `/portal/pending/request/${requestId}/approve`,
      null
    )
  }

  approvePortalRequest: IApproveRequest = body => {
    return this.apiCall
      .mutate(APPROVE_REQUEST_QUERY, body)
      .map(res => res.approvePendingRequest)
  }

  declineRequest = requestId => {
    return this.apiCall.post(
      `/portal/pending/request/${requestId}/decline`,
      null
    )
  }

  declinePortalRequest: IDeclineRequest = body => {
    return this.apiCall
      .mutate(DECLINE_REQUEST_QUERY, body)
      .map(res => res.declinePendingRequest)
  }
}
