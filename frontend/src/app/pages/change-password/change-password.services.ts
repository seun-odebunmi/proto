import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import { IChangePassword, CHANGE_PASSWORD_QUERY } from './change-password.model'

@Injectable()
export class ChangePasswordService {
  constructor(private apiCall: ApiCallService) {}

  changePassword: IChangePassword = body => {
    return this.apiCall
      .mutate(CHANGE_PASSWORD_QUERY, body)
      .map(res => res.changePassword)
  }
}
