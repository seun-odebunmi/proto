export interface IBiller {
  billerID: number
  name: string
  code: string
  gatewayCode: string
  label: string
  productGroup: string
  charge: number
  status: boolean
  validationSupported: boolean
  processor: string
  categoryID: number
  categoryName: string
  billerType: string
}

export interface IGetBillersReturn {
  code: number
  description: string
  billers: IBiller[]
  totalRecordCount: number
}

export interface IUpdateBiller {
  name: string
  code: string
  gatewayCode: string
  label: string
  productGroup: string
  charge: number
  processor: string
  validationSupported: boolean
  categoryID: number
  billerID: number
}

export interface ICreateBiller {
  name: string
  code: string
  gatewayCode: string
  label: string
  productGroup: string
  charge: number
  processor: string
  validationSupported: boolean
  categoryID: number
}

export interface IGetBillers {
  pageNumber: number
  pageSize?: number
  billerName?: string
}
