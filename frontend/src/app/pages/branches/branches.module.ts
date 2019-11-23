import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { BranchComponent } from './branches.component'

import { BranchService } from './branches.services'
import { CountriesService } from '../countries/countries.services'
import { InstitutionService } from '../institutions/institutions.services'

export const routes = [
  { path: '', component: BranchComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [BranchComponent],
  providers: [BranchService, InstitutionService, CountriesService]
})
export class BranchModule {}
