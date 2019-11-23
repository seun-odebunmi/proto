import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { InbranchEnrollmentComponent } from './inbranch-enrollment.component'

import { InbranchEnrollmentService } from './inbranch-enrollment.services'
import { CustomerService } from '../customers/customers.services'

export const routes = [
  { path: '', component: InbranchEnrollmentComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [InbranchEnrollmentComponent],
  providers: [InbranchEnrollmentService, CustomerService]
})
export class InbranchEnrollmentModule {}
