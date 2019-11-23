import { Observable } from 'rxjs'

interface IChart {
  successRate: number
  failureRate: number
}

interface IDashboard {
  title: string
  period: string
  volume: number
  chart: IChart
}

interface IGetDashboardReturn {
  code: number
  dashboard: IDashboard[]
  description: string
}

interface IGetDashboardBody {
  startDate: string
  endDate: string
}

export interface IGetDashboard {
  (body: IGetDashboardBody): Observable<IGetDashboardReturn>
}
