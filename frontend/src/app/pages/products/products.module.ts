import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { ProductComponent } from './products.component'

import { ProductService } from './products.services'
import { BillerService } from '../billers/billers.services'

export const routes = [
  { path: '', component: ProductComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [ProductComponent],
  providers: [ProductService, BillerService]
})
export class ProductModule {}
