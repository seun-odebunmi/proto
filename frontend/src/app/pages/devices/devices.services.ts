import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { ApiCallService } from '../../services/api-call.service'
import { IGetDevices, IGetDevicesReturn } from './devices.model'

@Injectable()
export class DeviceService {
  constructor(private apiCall: ApiCallService) {}

  getDevices(body: IGetDevices): Observable<IGetDevicesReturn> {
    return this.apiCall.post('portal/device/list', body)
  }

  activateDevice(deviceID: number) {
    return this.apiCall.post(
      'portal/device/' + deviceID + '/enable/initiate',
      null
    )
  }

  deactivateDevice(deviceID: number) {
    return this.apiCall.post('portal/device/' + deviceID + '/disable', null)
  }

  releaseDevice(deviceID: number) {
    return this.apiCall.post(
      'portal/device/' + deviceID + '/release/initiate',
      null
    )
  }
}
