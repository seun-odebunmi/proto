import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { SetCustomerPinComponent } from './set-customer-pin.component'

import { SetCustomerPinService } from './set-customer-pin.services'

export const routes = [
  { path: '', component: SetCustomerPinComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [SetCustomerPinComponent],
  providers: [SetCustomerPinService]
})
export class SetCustomerPinModule {}
