export interface ILimitTypesSettings {}

export interface ISearchLimits {}

export interface IGetGlobalAuthLimitTypesReturn {
  code: number
  description: string
  settings: ILimitTypesSettings[]
  totalRecordCount: number
}

export interface ISearchGlobalAuthLimitReturn {
  code: number
  description: string
  limits: ISearchLimits[]
  totalRecordCount: number
}

export interface ISearchGlobalAuthLimit {
  //limitType: string
}

export interface IUpdateGlobalAuthLimit {
  settingID: number
  name: string
  perTransaction: number
  daily: number
}
