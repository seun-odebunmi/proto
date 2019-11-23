import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { ChangePasswordComponent } from './change-password.component'

import { ChangePasswordService } from './change-password.services'

export const routes = [
  { path: '', component: ChangePasswordComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [ChangePasswordComponent],
  providers: [ChangePasswordService]
})
export class ChangePasswordModule {}
