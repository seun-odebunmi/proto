export interface ISettings {
  code: string
  name: string
}

export interface ILimits {
  code: string
  createDate: number
  customerID: number
  daily: number
  limitID: number
  name: string
  perTransaction: number
  updateDate: number
}

export interface ICustomerName {
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

export interface IGetCustomerLimitTypesReturn {
  code: number
  description: string
  settings: ISettings[]
  totalRecordCount: string
}

export interface ISearchCustomerLimitReturn {
  code: number
  customerInfo: ICustomerName
  description: string
  limits: ILimits[]
  totalRecordCount: number
}

export interface ISearchCustomerLimit {
  customerID?: string
  accountNumber?: string
  pageNumber: number
  pageSize: number
}

export interface IUpdateCustomerLimit {
  limitID: number
  name: string
  perTransaction: number
  daily: number
}

export interface ICreateCustomerLimit {
  name: string
  perTransaction: number
  daily: number
  customerID: number
}
