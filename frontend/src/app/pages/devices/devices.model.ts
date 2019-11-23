export interface IDevice {
  activationCompleted: string
  activationStarted: string
  customerUsername: string
  deviceID: number
  deviceState: string
  model: string
  name: string
}

export interface IGetDevicesReturn {
  code: number
  description: string
  devices: IDevice[]
  totalRecordCount: number
}

export interface IGetDevices {
  pageNumber: number
  pageSize?: number
  customerID?: number
  accountNumber?: number
}
