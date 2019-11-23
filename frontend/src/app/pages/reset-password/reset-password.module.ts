import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { ResetPasswordComponent } from './reset-password.component'

export const routes = [
  { path: '', component: ResetPasswordComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [ResetPasswordComponent]
})
export class ResetPasswordModule {}
