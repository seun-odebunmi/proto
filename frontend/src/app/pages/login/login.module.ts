import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { LoginComponent } from './login.component'
import { LogoutComponent } from './logout.component'

export const routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [LoginComponent, LogoutComponent]
})
export class LoginModule {}
