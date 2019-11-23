import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { PendingRequestComponent } from './pending-requests.component'

import { PendingRequestService } from './pending-requests.services'

export const routes = [
  { path: '', component: PendingRequestComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [PendingRequestComponent],
  providers: [PendingRequestService]
})
export class PendingRequestModule {}
