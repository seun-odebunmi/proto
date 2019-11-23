import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { CustomerLimitComponent } from './customer-limits.component'

import { CustomerLimitService } from './customer-limits.services'
import { CustomerService } from '../customers/customers.services'

export const routes = [
  { path: '', component: CustomerLimitComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [CustomerLimitComponent],
  providers: [CustomerLimitService, CustomerService]
})
export class CustomerLimitModule {}
