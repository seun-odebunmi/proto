import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { AuditLogComponent } from './audit-logs.component'

import { AuditLogService } from './audit-logs.services'
import { PendingRequestService } from '../pending-requests/pending-requests.services'

export const routes = [
  { path: '', component: AuditLogComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AuditLogComponent],
  providers: [AuditLogService, PendingRequestService]
})
export class AuditLogModule {}
