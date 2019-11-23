import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { ActivityComponent } from './activities.component'

import { ActivityService } from './activities.services'

export const routes = [
  { path: '', component: ActivityComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [ActivityComponent],
  providers: [ActivityService]
})
export class ActivityModule {}
