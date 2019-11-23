import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { RoleFunctionComponent } from './role-functions.component'

import { RoleFunctionService } from './role-functions.services'
import { CountriesService } from '../countries/countries.services'
import { RoleService } from '../roles/roles.services'
import { InstitutionService } from '../institutions/institutions.services'

export const routes = [
  { path: '', component: RoleFunctionComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [RoleFunctionComponent],
  providers: [
    RoleFunctionService,
    RoleService,
    CountriesService,
    InstitutionService
  ]
})
export class RoleFunctionModule {}
