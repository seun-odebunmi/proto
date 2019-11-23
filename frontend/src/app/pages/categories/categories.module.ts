import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { CategoryComponent } from './categories.component'

import { CategoryService } from './categories.services'

export const routes = [
  { path: '', component: CategoryComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [CategoryComponent],
  providers: [CategoryService]
})
export class CategoryModule {}
