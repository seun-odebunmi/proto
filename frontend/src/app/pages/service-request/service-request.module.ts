import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { ServiceRequestComponent } from './service-request.component'

import { ServiceRequestService } from './service-request.services'

export const routes = [
  { path: '', component: ServiceRequestComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [ServiceRequestComponent],
  providers: [ServiceRequestService]
})
export class ServiceRequestModule {}
