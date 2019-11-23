import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { SecurityQuestionResetComponent } from './security-question-reset.component'

import { SecurityQuestionResetService } from './security-question-reset.services'
import { CustomerService } from '../customers/customers.services'

export const routes = [
  { path: '', component: SecurityQuestionResetComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [SecurityQuestionResetComponent],
  providers: [SecurityQuestionResetService, CustomerService]
})
export class SecurityQuestionResetModule {}
