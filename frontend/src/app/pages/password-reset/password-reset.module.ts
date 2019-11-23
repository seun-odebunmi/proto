import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { PasswordResetComponent } from './password-reset.component'

import { PasswordResetService } from './password-reset.services'
import { CustomerService } from '../customers/customers.services'

export const routes = [
  { path: '', component: PasswordResetComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [PasswordResetComponent],
  providers: [PasswordResetService, CustomerService]
})
export class PasswordResetModule {}
