import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { CustomerComponent } from './customers.component'

import { CustomerService } from './customers.services'

export const routes = [
  { path: '', component: CustomerComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [CustomerComponent],
  providers: [CustomerService]
})
export class CustomerModule {}
