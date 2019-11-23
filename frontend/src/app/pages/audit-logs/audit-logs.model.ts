import { Observable } from 'rxjs/Observable'
import gql from 'graphql-tag'

export const GET_AUDITS_QUERY = gql`
  query AuditTrail($input: AuditTrailInput!) {
    auditTrail(input: $input) {
      count
      rows {
        id
        createDate
        auditType
        details
        actionOn
        actionBy
        status
        sourceAccount
        userIp
      }
    }
  }
`

interface IAuditLog {
  id: number
  createDate: string
  auditType: string
  details: string
  actionOn: string
  actionBy: string
  status: string
  sourceAccount: String
  userIp: string
}

interface IGetAuditLogsReturn {
  count: number
  rows: IAuditLog[]
}

interface IGetAuditLogsBody {
  pageNumber: number
  pageSize?: number
  actionOn?: string
  actionBy?: string
  sourceAccount?: string
  auditType?: string
  startDate?: string
  endDate?: string
}

export interface IGetAuditLogs {
  (body: IGetAuditLogsBody): Observable<IGetAuditLogsReturn>
}
