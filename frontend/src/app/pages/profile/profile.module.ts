import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { ProfileComponent } from './profile.component'

import { ProfileService } from './profile.services'

export const routes = [
  { path: '', component: ProfileComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [ProfileComponent],
  providers: [ProfileService]
})
export class ProfileModule {}
