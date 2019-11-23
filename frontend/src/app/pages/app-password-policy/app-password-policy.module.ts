import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { AppPasswordPolicyComponent } from './app-password-policy.component'

import { AppPasswordPolicyService } from './app-password-policy.services'

export const routes = [
  { path: '', component: AppPasswordPolicyComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AppPasswordPolicyComponent],
  providers: [AppPasswordPolicyService]
})
export class AppPasswordPolicyModule {}
