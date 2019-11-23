export interface ILimitTypesSettings {}

export interface ISearchSettings {
  code: string
  count: number
  daily: number
  name: string
  perTransaction: number
  settingID: number
}

export interface IGetGlobalLimitTypesReturn {
  code: number
  description: string
  settings: ILimitTypesSettings[]
  totalRecordCount: number
}

export interface ISearchGlobalLimitReturn {
  code: number
  description: string
  settings: ISearchSettings[]
  totalRecordCount: number
}

export interface ISearchGlobalLimit {
  //limitType: string
}

export interface IUpdateGlobalLimit {
  settingID: number
  name: string
  count: string
  perTransaction: number
  daily: number
}
