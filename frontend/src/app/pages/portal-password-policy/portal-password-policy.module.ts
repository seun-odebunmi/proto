import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { PortalPasswordPolicyComponent } from './portal-password-policy.component'

import { PortalPasswordPolicyService } from './portal-password-policy.services'

export const routes = [
  { path: '', component: PortalPasswordPolicyComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [PortalPasswordPolicyComponent],
  providers: [PortalPasswordPolicyService]
})
export class PortalPasswordPolicyModule {}
