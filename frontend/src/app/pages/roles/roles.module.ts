import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { RoleComponent } from './roles.component'

import { RoleService } from './roles.services'
import { CountriesService } from '../countries/countries.services'
import { InstitutionService } from '../institutions/institutions.services'

export const routes = [
  { path: '', component: RoleComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [RoleComponent],
  providers: [RoleService, InstitutionService, CountriesService]
})
export class RoleModule {}
