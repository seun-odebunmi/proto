import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { AppVersionComponent } from './app-version.component'

import { AppVersionService } from './app-version.services'

export const routes = [
  { path: '', component: AppVersionComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [AppVersionComponent],
  providers: [AppVersionService]
})
export class AppVersionModule {}
