import { Observable } from 'rxjs/Observable'

interface Customer {
  customerID: number
  customerName: string
  enabled: boolean
  mobileNumber: string
  primaryAccountNumber: string
  regCompleted: number
  regStarted: number
  regStatus: string
  username: string
}

interface GetCustomersBody {
  pageNumber: number
  pageSize: number
  regStatus: string
  accountNumber?: string
  startDate?: string
  endDate?: string
}

interface GetCustomersResponse {
  code: number
  description: string
  customers: Customer[]
  totalRecordCount: number
}

export interface IGetCustomers {
  (body: GetCustomersBody): Observable<GetCustomersResponse>
}

interface GetRegStatusResponse {
  code: number
  description: string
  regStatuses: Array<any>
}

export interface IGetRegStatus {
  (): Observable<GetRegStatusResponse>
}

interface SearchCustomerBody {
  pageNumber?: number
  pageSize?: number
  customerID?: string
  accountNumber?: string
  startDate?: string
  endDate?: string
}

interface SearchCustomerResponse {
  code: number
  description: string
  customer: Customer
  totalRecordCount: number
}

export interface ISearchCustomer {
  (body: SearchCustomerBody): Observable<SearchCustomerResponse>
}

export interface IActivateCustomer {
  (customerId: number): Observable<any>
}

export interface IDeactivateCustomer {
  (customerId: number, reason: string): Observable<any>
}

export interface IReleaseCustomer {
  (customerId: number): Observable<any>
}
