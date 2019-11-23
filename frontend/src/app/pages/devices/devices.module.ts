import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared.module'

import { DeviceComponent } from './devices.component'

import { DeviceService } from './devices.services'

export const routes = [
  { path: '', component: DeviceComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [DeviceComponent],
  providers: [DeviceService]
})
export class DeviceModule {}
