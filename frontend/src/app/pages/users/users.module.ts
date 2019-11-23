import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { UserComponent } from './users.component'

import { UserService } from './users.services'
import { RoleService } from '../roles/roles.services'
import { BranchService } from '../branches/branches.services'
import { CountriesService } from '../countries/countries.services'
import { InstitutionService } from '../institutions/institutions.services'

export const routes = [
  { path: '', component: UserComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [UserComponent],
  providers: [
    UserService,
    RoleService,
    BranchService,
    InstitutionService,
    CountriesService
  ]
})
export class UserModule {}
