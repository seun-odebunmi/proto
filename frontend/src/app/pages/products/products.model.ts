export interface IProduct {
  productID: number
  code: string
  name: string
  amount: number
  amountFixed: boolean
  status: boolean
  gatewayCode: string
  processor: string
  billerID: number
}

export interface IGetProductsReturn {
  code: number
  description: string
  products: IProduct[]
  totalRecordCount: number
}

export interface IUpdateProduct {
  name: string
  code: string
  // minAmount: number
  // maxAmount: number
  amount: number
  gatewayCode: string
  processor: string
  billerID: number
  productID: number
}

export interface ICreateProduct {
  name: string
  code: string
  // minAmount: number
  // maxAmount: number
  amount: number
  gatewayCode: string
  processor: string
  billerID: number
}

export interface IGetProducts {
  pageNumber: number
  pageSize?: number
  productName?: string
  billerID: string
}
