import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { CountriesComponent } from './countries.component'

import { CountriesService } from './countries.services'

export const routes = [
  { path: '', component: CountriesComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [CountriesComponent],
  providers: [CountriesService]
})
export class CountryModule {}
