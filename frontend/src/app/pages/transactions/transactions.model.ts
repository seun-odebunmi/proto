export interface IGetTransactions {
  pageNumber: number
  pageSize?: number
  filterKey?: string
  filterValue?: string
  transTypeCode: string
  sourceAccount?: string
  startDate?: string
  endDate?: string
}
