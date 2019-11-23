export interface IBank {
  bankID: number
  code: string
  name: string
  gatewayCode: string
  status: boolean
  processor: string
}

export interface IGetBanksReturn {
  code: number
  description: string
  banks: IBank[]
  totalRecordCount: number
}

export interface IUpdateBank {
  name: string
  code: string
  gatewayCode: string
  bankID: number
}

export interface ICreateBank {
  name: string
  code: string
  gatewayCode: string
}

export interface IGetBanks {
  pageNumber: number
  pageSize?: number
  bankName?: string
}
