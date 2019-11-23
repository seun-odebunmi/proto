import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { BillerComponent } from './billers.component'

import { BillerService } from './billers.services'
import { CategoryService } from '../categories/categories.services'

export const routes = [
  { path: '', component: BillerComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [BillerComponent],
  providers: [BillerService, CategoryService]
})
export class BillerModule {}
