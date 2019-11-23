export interface IServiceRequests {
  serviceRequestID: number
  customerFullname: string
  chargeAmount: number
  status: boolean
  phoneNumber: string
  accountNumber: string
  lastUpdated: string
  dateCreated: string
  requestStatus: string
  requestType: string
}

export interface IGetServiceRequestsReturn {
  code: number
  description: string
  serviceRequests: IServiceRequests[]
  totalRecordCount: number
}

export interface IReqStatusReturn {
  code: number
  description: string
  serviceRequestStatuses: Array<any>
}

export interface IGetServiceRequests {
  pageNumber: number
  pageSize?: number
  accountNumber?: string
  regStatus?: string
  startDate?: string
  endDate?: string
}
