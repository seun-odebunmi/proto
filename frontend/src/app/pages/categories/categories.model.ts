export interface ICategory {
  categoryID: number
  name: string
  code: string
  description: string
  status: boolean
  gatewayCode: string
}

export interface IGetCategoriesReturn {
  code: number
  description: string
  categories: ICategory[]
  totalRecordCount: number
}

export interface IUpdateCategory {
  name: string
  code: string
  description: string
  gatewayCode: string
  //status: boolean
  categoryID: number
}

export interface ICreateCategory {
  name: string
  code: string
  description: string
  gatewayCode: string
  //status: boolean
}

export interface IGetCategories {
  pageNumber: number
  pageSize?: number
  categoryName?: string
}
