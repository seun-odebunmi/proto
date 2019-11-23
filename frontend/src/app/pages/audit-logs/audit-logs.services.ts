import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import { IGetAuditLogs, GET_AUDITS_QUERY } from './audit-logs.model'

@Injectable()
export class AuditLogService {
  constructor(private apiCall: ApiCallService) {}

  getAuditLogs: IGetAuditLogs = body =>
    this.apiCall.query(GET_AUDITS_QUERY, body).map(res => res.auditTrail)
}
