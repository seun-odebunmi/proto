import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { GlobalLimitComponent } from './global-limits.component'

import { GlobalLimitService } from './global-limits.services'

export const routes = [
  { path: '', component: GlobalLimitComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [GlobalLimitComponent],
  providers: [GlobalLimitService]
})
export class GlobalLimitModule {}
