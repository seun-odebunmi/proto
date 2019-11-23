import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { RegisterComponent } from './register.component'

export const routes = [
  { path: '', component: RegisterComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [RegisterComponent]
})
export class RegisterModule {}
