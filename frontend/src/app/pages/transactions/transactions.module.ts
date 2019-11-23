import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { TransactionComponent } from './transactions.component'

import { TransactionService } from './transactions.services'

export const routes = [
  { path: '', component: TransactionComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [TransactionComponent],
  providers: [TransactionService]
})
export class TransactionModule {}
