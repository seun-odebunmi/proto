import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { InstitutionComponent } from './institutions.component'

import { InstitutionService } from './institutions.services'
import { CountriesService } from '../countries/countries.services'

export const routes = [
  { path: '', component: InstitutionComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [InstitutionComponent],
  providers: [InstitutionService, CountriesService]
})
export class InstitutionModule {}
