import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { BankComponent } from './banks.component'

import { BankService } from './banks.services'

export const routes = [
  { path: '', component: BankComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [BankComponent],
  providers: [BankService]
})
export class BankModule {}
