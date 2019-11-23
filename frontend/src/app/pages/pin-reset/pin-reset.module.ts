import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { PinResetComponent } from './pin-reset.component'

import { PinResetService } from './pin-reset.services'
import { CustomerService } from '../customers/customers.services'

export const routes = [
  { path: '', component: PinResetComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [PinResetComponent],
  providers: [PinResetService, CustomerService]
})
export class PinResetModule {}
