export interface IActivity {
  branchCode: string
  id: number
  name: string
}

export interface IGetActivitiesReturn {
  activities: IActivity[]
  code: number
  description: string
  totalRecordCount: number
}

export interface IGetActivities {
  pageNumber: number
  pageSize?: number
  startDate: string
  endDate: string
  sourceAccount?: number
  customerID?: string
}

export interface IGetReportDataReturn {
  code: number
  reports: []
}

export interface IGetReportData {
  startDate: string
  endDate: string
}
