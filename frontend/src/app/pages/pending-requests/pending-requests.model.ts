import { Observable } from 'rxjs/Observable'
import gql from 'graphql-tag'

export const GET_PENDING_REQUEST_QUERY = gql`
  query PendingRequests($input: PendingRequestsInput!) {
    pendingRequests(input: $input) {
      count
      rows {
        id
        actionOn
        description
        additionalInfo
        requestDate
        requestType
        requestorEmail
        requestor
        status
        portalAction
      }
    }
  }
`

export const GET_REQUEST_TYPE_QUERY = gql`
  query RequestTypes {
    requestTypes {
      key
      value
    }
  }
`

export const APPROVE_REQUEST_QUERY = gql`
  mutation ApprovePendingRequest($input: ApproveRequestInput!) {
    approvePendingRequest(input: $input) {
      success
      description
    }
  }
`

export const DECLINE_REQUEST_QUERY = gql`
  mutation DeclinePendingRequest($input: DeclineRequestInput!) {
    declinePendingRequest(input: $input) {
      success
      description
    }
  }
`

interface MutateResponse {
  success: string
  description: string
}

export interface IDeclineRequest {
  (body: { requestId: number }): Observable<MutateResponse>
}

export interface IApproveRequest {
  (body: { requestId: number }): Observable<MutateResponse>
}

interface IGetRequestTypesReturn {
  key: string
  value: string
}

export interface IGetRequestType {
  (): Observable<IGetRequestTypesReturn[]>
}

interface IPendingRequests {
  id: string
  actionOn: string
  additionalInfo: string
  description: string
  requestDate: string
  requestType: string
  requestor: string
  requestorEmail: string
  status: string
  portalAction: boolean
}

interface IGetPendingRequestsReturn {
  rows: IPendingRequests[]
  count: number
}

interface IGetPendingRequestsBody {
  pageNumber: number
  pageSize?: number
  requestType?: string
  startDate?: string
  endDate?: string
}

export interface IGetPendingRequests {
  (body: IGetPendingRequestsBody): Observable<IGetPendingRequestsReturn>
}
