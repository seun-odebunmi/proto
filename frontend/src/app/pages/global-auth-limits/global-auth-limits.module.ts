import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { GlobalAuthLimitComponent } from './global-auth-limits.component'

import { GlobalAuthLimitService } from './global-auth-limits.services'

export const routes = [
  { path: '', component: GlobalAuthLimitComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [GlobalAuthLimitComponent],
  providers: [GlobalAuthLimitService]
})
export class GlobalAuthLimitModule {}
