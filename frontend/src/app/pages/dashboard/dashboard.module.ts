import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { DashboardComponent } from './dashboard.component'
import { DashboardService } from './dashboard.services'

export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [DashboardComponent],
  providers: [DashboardService]
})
export class DashboardModule {}
